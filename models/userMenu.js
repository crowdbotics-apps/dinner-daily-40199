const rfr = require('rfr');
const cron = require('node-cron');

const pool = rfr('/db/index');
const constant = rfr('/shared/constant');
const utils = rfr('/shared/utils');
const helper = rfr('/shared/helper');
const dbQuery = rfr('/shared/query');
const algorithmModel = rfr('/models/algorithm/menuGenerator');

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

const _formatDataForUserWeekDayMenuAlternatives = (weekMenuId, userMenu, dateTime) => {
  let weekDayMenuAlternatives = [];
  for (let i = 0; i < 5; i++) {
    let menu = userMenu[i+5];
    let obj = {
      'user_week_menu_id': weekMenuId,
      'recipe_id': menu.id,
      'type': 1,
      'week_day_number': 1,
      'is_on_sale': 0,
      'created': dateTime || helper.getDateAndTime(),
      'updated': dateTime || null
    }
    weekDayMenuAlternatives.push(obj);
  }
  const { columns, valuesArr } = utils.formatRequestDataForInsert(weekDayMenuAlternatives);
  const queryParam = dbQuery.insertQuery(constant['DB_TABLE']['USER_WEEK_DAY_MENU_ALTERNATIVES'], columns);
  return { alternativesQueryParam: queryParam, alternativesValuesArr: valuesArr };
}

const _fetchAndFormatRecIngredients = async (userId, storeId, userMenu, shoppingListId) => {
  //fetch data for shopping list item
  let selectQueryParam = dbQuery.fetchShoppingIngredient(userId, storeId);
  if (shoppingListId) {
      let recipeIds = [];
      for (let i = 0; i < 5; i++) {
        recipeIds.push(userMenu[i].id);
        if (userMenu[i].firstSideId) recipeIds.push(userMenu[i].firstSideId);
        if (userMenu[i].secSideId) recipeIds.push(userMenu[i].secSideId);
      }
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
  utils.log('User week menu data inside insert function: ', weekMenuData);
  let { columns, valuesArr } = utils.formatRequestDataForInsert([weekMenuData]);
  const insertQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['USER_WEEK_MENUS'], columns);
  const conn = await pool.getConnection();
  try {
      await conn.query('START TRANSACTION');
      return conn.query(insertQueryParam, [valuesArr])
          .then(async res => {
            let weekMenuId = res[0]['insertId'];
            //insert data in user week day menu table
            const { queryParam, valuesArr } = _formatDataForUserWeekDayMenu(weekMenuId, userMenu);
            await conn.query(queryParam, [valuesArr]);
            //insert data in user week day menu alternative table
            const { alternativesQueryParam, alternativesValuesArr } = _formatDataForUserWeekDayMenuAlternatives(weekMenuId, userMenu);
            await conn.query(alternativesQueryParam, [alternativesValuesArr]);
            //insert data in shopping list table
            const { shoppingListQueryParam, shoppingListValuesArr } = _formatDataForShoppingList(weekMenuId, familySize);
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
  const selectQuery = dbQuery.selectQuery(constant['DB_TABLE']['USER_WEEK_MENUS'], [], {user_id: userId, 'DATE(created) >': 'DATE_SUB(CURDATE(), INTERVAL 6 DAY)'});
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
              // Deleted existing week menu alternatives
              const alternativesDeleteQueryParam = dbQuery.deleteQuery(constant['DB_TABLE']['USER_WEEK_DAY_MENU_ALTERNATIVES'], {user_week_menu_id: weekMenuId});
              await conn.query(alternativesDeleteQueryParam);
              //insert data in user week day menu alternative table
              const { alternativesQueryParam, alternativesValuesArr } = _formatDataForUserWeekDayMenuAlternatives(weekMenuId, userMenu, res[0]['created']);
              await conn.query(alternativesQueryParam, [alternativesValuesArr]);
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
            await conn.query('COMMIT');
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

// cron job to run every day at midnight to create user week menu
cron.schedule('0 6 * * *', async () => {
  try {
    const queryParam = dbQuery.userMenuCronQuery;;
    return await pool.query(queryParam)
    .then(async ([resp]) => {
      for (let i = 0; i < resp.length; i++) {
        try {
          utils.writeInsideFunctionLog('userMenu', 'cronJob started for - ', resp[i].id, new Date());
          utils.log('Cron job started for ->', resp[i].id);
          console.log('Cron job started for ->', resp[i].id);
          const userMenu = await algorithmModel.createMenu(resp[i], 'update');
          await insertDataInUserWeekMenu(resp[i].id, userMenu, resp[i]['preferred_store_id'], resp[i]['family_size']);
          utils.writeInsideFunctionLog('userMenu', 'cronJob', 'data end for user');
          utils.log('data end for user');
          console.log('data end for user');
        } catch (error) {
          utils.writeErrorLog('menuGenerator', 'cronJob', 'Error while creating user menu for every week through node cron for user: ', resp[i].id, error);
          continue;
        }
      }
      utils.log('Menu generation cron job task has been done');
      console.log('Menu generation cron job task has been done');
      return true;
    }).catch(err => {
        utils.writeErrorLog('menuGenerator', 'cronJob', 'Error while fetching user whose menu need to generate', err);
        utils.log('Error while fetching user whose menu need to generate: ', err);
    })
  } catch (err) {
    utils.writeErrorLog('menuGenerator', 'cronJob', 'Error while creating user menu for every week through node cron', err);
    utils.log('Error while creating user menu for every week through node cron: ', err);
  }
});

module.exports = {
	insertDataInUserWeekMenu,
  updateUserWeekDayMenu
}
