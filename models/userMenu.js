const rfr = require('rfr');

const pool = rfr('/db/index');
const constant = rfr('/shared/constant');
const utils = rfr('/shared/utils');
const helper = rfr('/shared/helper');
const dbQuery = rfr('/shared/query');

const _formatDataForShoppingList = (weekMenuId, familySize) => {
  let obj = {
      'updated': helper.getDateAndTime(),
      'created': helper.getDateAndTime(),
      'user_week_menu_id': weekMenuId,
      'family_size': familySize,
      'fulfillment_initialized': 0
  }
  const { columns, valuesArr } = utils.formatRequestDataForInsert([obj]);
  const queryParam = dbQuery.insertQuery(constant['DB_TABLE']['SHOPPING_LISTS'], columns);
  return { shoppingListQueryParam: queryParam, shoppingListValuesArr: valuesArr };
}

const _fetchAndFormatRecIngredients = async (userId, storeId, userMenu, shoppingListId) => {
  //fetch data for shopping list item
  let selectQueryParam = dbQuery.fetchShoppingIngredient(userId, storeId);
  if (shoppingListId) {
      let recipeIds = [];
      userMenu.forEach(menu => {
        recipeIds.push(menu.id);
        if (menu.firstSideId) recipeIds.push(menu.firstSideId);
        if (menu.secSideId) recipeIds.push(menu.secSideId);
      })
      selectQueryParam = dbQuery.fetchShoppingIngredientForNewUser(recipeIds, storeId);
  }
  const [rows] = await pool.query(selectQueryParam);
  rows.forEach(row => {
      row['type'] = 1;
      row['created'] = helper.getDateAndTime();
      row['checked_off'] = 0;
      row['dish_type'] = 1;
      row['is_on_sale'] = row['is_on_sale'] || 0;
      row['shopping_list_id'] = row['shopping_list_id'] || shoppingListId;
      row['formatted_amount'] = `${utils.formatAmount(row['amount'])}${row['name']}`;
      delete row['name'];
  });
  // insert data in shopping list items table
  let { columns: shoppingListItemsColumns, valuesArr: shoppingListItemsValuesArr } = utils.formatRequestDataForInsert(rows);
  const shoppingListItemsQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['SHOPPING_LIST_ITEMS'], shoppingListItemsColumns);
  return { shoppingListItemsQueryParam, shoppingListItemsValuesArr };
}

const _formatDataForUserWeekDayMenu = (weekMenuId, userMenu, dateTime) => {
  let weekDayMenu = [];
  for (let i = 0; i < 5; i++) {
      let menu = userMenu[i];
      let obj = {
          'week_menu_id': weekMenuId,
          'main_recipe_id': menu.id,
          'first_side_recipe_id': menu.firstSideId || null,
          'second_side_recipe_id': menu.secSideId || null,
          'created': dateTime || helper.getDateAndTime(),
          'updated': dateTime || null,
          'original_main_recipe_id': menu.id,
          'original_first_side_recipe_id': menu.firstSideId || null,
          'original_second_side_recipe_id': menu.secSideId || null,
          'week_day_number': i+1,
          'week_day_date': dateTime || helper.getDateAndTime()
      }
      weekDayMenu.push(obj);
  }
  const { columns, valuesArr } = utils.formatRequestDataForInsert(weekDayMenu);
  const queryParam = dbQuery.insertQuery(constant['DB_TABLE']['USER_WEEK_DAY_MENUS'], columns);
  return { queryParam, valuesArr };
}

// Function to insert data in user week menu, user week menu day, shopping list and corresponding tables
const insertDataInUserWeekMenu = async (userId, userMenu, storeId, familySize = 1) => {
  utils.writeInsideFunctionLog('userMenu', 'insertDataInUserWeekMenu', userMenu);
  const weekMenuData = helper.weekMenu;
  weekMenuData['user_id'] = userId;
  weekMenuData['store_id'] = storeId;
  let { columns, valuesArr } = utils.formatRequestDataForInsert([weekMenuData]);
  const insertQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['USER_WEEK_MENUS'], columns);
  const conn = await pool.getConnection();
  try {
      await conn.query('START TRANSACTION');
      return conn.query(insertQueryParam, [valuesArr])
          .then(async res => {
            //insert data in user week day menu table
            const { queryParam, valuesArr } = _formatDataForUserWeekDayMenu(res[0]['insertId'], userMenu);
            await conn.query(queryParam, [valuesArr]);
            //insert data in shopping list table
            const { shoppingListQueryParam, shoppingListValuesArr } = _formatDataForShoppingList(res[0]['insertId'], familySize);
            return await conn.query(shoppingListQueryParam, [shoppingListValuesArr]);
          }).then(async sRes => {
            if (Array.isArray(sRes)) {
              let { shoppingListItemsQueryParam, shoppingListItemsValuesArr } = await _fetchAndFormatRecIngredients(userId, storeId, userMenu, sRes[0]['insertId']);
              return await conn.query(shoppingListItemsQueryParam, [shoppingListItemsValuesArr]);
            }
          }).then(async resp => {
              await conn.query('COMMIT');
              await conn.release();
          })
          .catch(async err => {
              await conn.query('ROLLBACK');
              await conn.release();
              utils.writeErrorLog('userMenu', 'insertDataInUserWeekMenu', 'Error while saving data in user week menu and shopping list table', err);
              throw err;
          });
  } catch (error) {
      await conn.query('ROLLBACK');
      await conn.release();
      utils.writeErrorLog('userMenu', 'insertDataInUserWeekMenu', 'Error during saving data in user week menu', error);
      throw error;
  }
}

// Function to update data in user week day menu, shopping list and corresponding tables
const updateUserWeekDayMenu = async (userId, userMenu, storeId, familySize = 1) => {
  utils.writeInsideFunctionLog('userMenu', 'updateUserWeekDayMenu', userMenu);
  const selectQuery = dbQuery.getUserCurrentWeekMenuQuery(userId);
  const conn = await pool.getConnection();
  try {
      await conn.query('START TRANSACTION');
      return conn.query(selectQuery)
          .then(async ([res]) => {
            //check user current week menu data
            if (!!res.length) {
              const weekMenuId = res[0]['id'];
              // Deleted existing week menu
              const deleteQueryParam = dbQuery.deleteQuery(constant['DB_TABLE']['USER_WEEK_DAY_MENUS'], {week_menu_id: weekMenuId});
              await conn.query(deleteQueryParam);
              // Add new week menu for user
              const { queryParam, valuesArr } = _formatDataForUserWeekDayMenu(weekMenuId, userMenu, res[0]['created']);
              await conn.query(queryParam, [valuesArr]);
              //Update data in shopping list table
              const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['SHOPPING_LISTS'], {family_size: familySize}, {user_week_menu_id: weekMenuId});
              return await conn.query(updateQueryParam);
            }
            return true;
          }).then(async sRes => {
            await conn.query('COMMIT');
            //delete existing shopping list items
            const deleteShoppingListItemsQueryParam = dbQuery.deleteShoppingListItems(userId);
            await conn.query(deleteShoppingListItemsQueryParam);
            // Add new shopping list items
            let { shoppingListItemsQueryParam, shoppingListItemsValuesArr } = await _fetchAndFormatRecIngredients(userId, storeId, userMenu);
            await conn.query(shoppingListItemsQueryParam, [shoppingListItemsValuesArr]);
            return await conn.release();
          })
          .catch(async err => {
              await conn.query('ROLLBACK');
              await conn.release();
              utils.writeErrorLog('userMenu', 'updateUserWeekDayMenu', 'Error while updating data in user week day menu and shopping list table', err);
              throw err;
          });
  } catch (error) {
      await conn.query('ROLLBACK');
      await conn.release();
      utils.writeErrorLog('userMenu', 'updateUserWeekDayMenu', 'Error during updating data in user week day menu table', error);
      throw error;
  }
}


module.exports = {
	insertDataInUserWeekMenu,
  updateUserWeekDayMenu
}
