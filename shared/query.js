const rfr = require("rfr");
const constant = rfr("/shared/constant");

const _whereCondition = (conditionObj, isSearchQuery) => {
    let keys = Object.keys(conditionObj);
    let values = Object.values(conditionObj);
    let query = '';
    if (keys && keys.length) {
        query += isSearchQuery ? ' and ' : ' where ';
        for (let i = 0; i < keys.length; i++) {
            if (i === keys.length - 1) {
                query += (values[i] === null ? `${keys[i]} is ${values[i]}` : `${keys[i]}= ${values[i]}`);
            } else {
                query += (values[i] === null ? `${keys[i]} is ${values[i]} and ` : `${keys[i]}= ${values[i]} and `);
            }
        }
    }
    return query;
}

const _orderQuery = (obj)=>{
    let query = '';
    if (obj.hasOwnProperty('order_key') && obj.hasOwnProperty('order_type')) {
        query += ` order by ${obj.order_key} ${obj.order_type}`
        }
    if (obj.hasOwnProperty('limit') && obj.hasOwnProperty('offset')) {
        query += ` limit ${obj.offset},${obj.limit}`
      }
   return query
}

const selectQuery = (table, columnArr = [], conditionObj = {}, paginationObj = {} ) => {
    let query = `Select ${columnArr.length ? columnArr.join(', ') : '*'} from ${constant['DB_NAME']}.${table}`;
    const whereQuery = _whereCondition(conditionObj);
    let orderQuery =  _orderQuery(paginationObj);
    query += whereQuery;
    query += orderQuery;
    return query;
}

const fetchAdminRecipeQuery = (conditionObj = {}, paginationObj = {} ) => {
    let query = `SELECT re.*, np.calories, np.fats, np.carbs, np.fiber, np.protein, np.saturated_fats,np.sodium FROM ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPES']} re left join ${constant['DB_NAME']}.${constant['DB_TABLE']['NUTRITIONAL_PROFILE']} np on re.nutritional_profile_id = np.id`;
    const whereQuery = _whereCondition(conditionObj);
    let orderQuery =  _orderQuery(paginationObj);
    query += whereQuery;
    query += orderQuery;
    return query;
}

const searchQuery = (table, searchKey, searchText, columnArr = [], conditionObj = {}, paginationObj = {}) => {
    let query = `SELECT ${columnArr.length ? columnArr.join(', ') : '*'} FROM ${constant['DB_NAME']}.${table} where ${searchKey} like '%${searchText}%'`;
    const whereQuery = _whereCondition(conditionObj, true);
    let orderQuery =  _orderQuery(paginationObj);
    query += whereQuery;
    query += orderQuery;
    return query;
}

const fetchAdminIngredientsQuery = (paginationObj={},whereCondition={})=>{
    let query = `SELECT i.*, ic.name categoryName FROM ${constant['DB_NAME']}.${constant['DB_TABLE']['INGREDIENTS']} i left join ${constant['DB_NAME']}.${constant['DB_TABLE']['INGREDIENTS_CATEGORY']} ic on i.category_ids = ic.id `
    let orderQuery =  _orderQuery(paginationObj);
    const whereQuery = _whereCondition(whereCondition);
    query += whereQuery;
    query += orderQuery;
    return query;
}

const fetchSidesQuery = (recipeId) =>`SELECT crst.recipe_side_item_id, ht.name, crst.hash_tag_id, rst.side, rst.recipe_side_combination_id, rst.id, rsc.recipe_id
FROM ${constant['DB_TABLE']['CROSS_RECIPE_SIDE_ITEMTAG']} crst
join ${constant['DB_TABLE']['RECIPE_ITEMS']} rst on rst.id = crst.recipe_side_item_id
join ${constant['DB_TABLE']['RECIPE_COMBINATIONS']} rsc on rsc.id = rst.recipe_side_combination_id
join ${constant['DB_TABLE']['HASH_TAGS']} ht on ht.id = crst.hash_tag_id
where ht.type = 2 and rsc.recipe_id = ${recipeId}`;


const insertQuery = (table, columns) => `Insert into ${constant['DB_NAME']}.${table} (${columns.join(', ')}) values ? `;

const updateQuery = (table, dataObj, conditionObj = {}) => {
    let columns = Object.keys(dataObj);
    let values = Object.values(dataObj);
    let query = `Update ${constant['DB_NAME']}.${table} set `;
    for (let i = 0; i < columns.length; i++) {
        if (i === values.length - 1) {
            if(typeof values[i] === 'number' || typeof values[i] === 'object') query += `${columns[i]} = ${values[i]}`;
            else query += `${columns[i]} = '${values[i]}'`;
        } else {
            if(typeof values[i] === 'number' || typeof values[i] === 'object') query += `${columns[i]} = ${values[i]}, `;
            else query += `${columns[i]} = '${values[i]}', `;
        }
    }
    const whereQuery = _whereCondition(conditionObj);
    query += whereQuery;
    return query;
}

const updateWithDuplicateKeyQuery = (table, dataArr, dupColumn = []) => {
    let keys = Object.keys(dataArr[0]);
    let values = dataArr.map( obj => keys.map(key => obj[key]));
    let query = `Insert into ${constant['DB_NAME']}.${table} (${keys.join(', ')}) values`;
    for (let i = 0; i < values.length; i++) {
        if (i === values.length - 1) {
            query += `(${values[i].join(`, `)})`;
        } else {
            query += `(${values[i].join(`, `)}), `;
        }
    }
    query += ` on duplicate key update `;
    for (let i = 0; i < dupColumn.length; i++) {
        if (i === dupColumn.length - 1) {
            query += `${dupColumn[i]} = values(${dupColumn[i]})`;
        } else {
            query += `${dupColumn[i]} = values(${dupColumn[i]}), `;
        }
    }
    return query;
}

const deleteQuery = (table, conditionObj = {}) => {
    let query = `Delete from ${constant['DB_NAME']}.${table}`;
    const whereQuery = _whereCondition(conditionObj);
    query += whereQuery;
    return query;
}

const adminDashBoardQuery = (table)=>{
  let query = `SELECT roles,
  COUNT(CASE WHEN roles = '${constant["ROLE_USER"]}' AND enabled = ${constant["DISABLED"]} THEN 1 END) AS inactiveUser,
  COUNT(CASE WHEN roles = '${constant["ROLE_USER"]}' AND enabled = ${constant["ENABLED"]} THEN 1 END) AS activeUser,
  COUNT(CASE WHEN roles != '${constant["ROLE_USER"]}' THEN 1 END) AS adminUser
  FROM ${constant['DB_NAME']}.${table} GROUP BY roles`;
  return query
}

const deleteMultipleQuery = (table, column, idsArr) => `Delete from ${constant['DB_NAME']}.${table} where ${column} in (${idsArr.join(', ')})`;

const fetchUserQuery = (userId) => `Select u.heart_healthy, u.family_size, u.state, u.preferred_store_id,
 udp.id as uid, udp.value, udp.checked,
 dp.*, st.name as storeName, st.sale_period_start, st.sale_period_end, s.name as stateName
 from ${constant['DB_NAME']}.${constant['DB_TABLE']['DIET_PLAN_OPTIONS']} dp
 join ${constant['DB_NAME']}.${constant['DB_TABLE']['USER_DIET_PLAN_OPTIONS']} udp on udp.diet_plan_option_id = dp.id
 join ${constant['DB_NAME']}.${constant['DB_TABLE']['USERS']} u on u.id = udp.user_id
 join ${constant['DB_NAME']}.${constant['DB_TABLE']['STORES']} st on st.id = u.preferred_store_id
 left join ${constant['DB_NAME']}.${constant['DB_TABLE']['STATES']} s on s.id = u.state
 where user_id = ${userId};`;

 const fetchUserForNotificationsQuery = (userGroup, storeId) => {
    let query = `select u.id, u.email from
    ${constant['DB_NAME']}.${constant['DB_TABLE']['USERS']} u
    where notification = ${constant['ENABLED']} and enabled = ${constant['ENABLED']}`;
    if (userGroup !== 'All') {
        query += ` and subscription_plan is ${userGroup === 'subscribed' ? 'not' : ''} null`;
    }
    if (storeId.length) {
        query +=` and preferred_store_id in (${storeId.join(', ')});`;
    }
    return query;
 }

 const fetchIngredientsQuery = (recipeId) => `SELECT ri.*, ri.id rid, i.*, im.name as measurement_name
    FROM ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPE_INGREDIENTS']} ri
    join ${constant['DB_NAME']}.${constant['DB_TABLE']['INGREDIENTS']} i on i.id = ri.ingredient_id
    left join ${constant['DB_NAME']}.${constant['DB_TABLE']['INGREDIENTS_MEASUREMENTS']} im on im.id = ri.cooking_measurement_id
    where recipe_id = ${recipeId};`;

const updateWeekMenuQuery = (userId, recipeType, weekDayMenuId, newRecipeId) =>
    `update ${constant['DB_NAME']}.${constant['DB_TABLE']['USER_WEEK_DAY_MENUS']} uwdm
    join ${constant['DB_NAME']}.${constant['DB_TABLE']['USER_WEEK_MENUS']} uwm on uwdm.week_menu_id = uwm.id
    set ${recipeType} = ${newRecipeId} where uwm.user_id = ${userId} and uwdm.id = ${weekDayMenuId}`;

const fetchUserWeekMenuQuery = (userId) => `select uwdm.*, uwdm.id as week_day_menu_id, r.*, r.id as recipe_id, np.*,
CASE
WHEN f.id is not null
THEN true
ELSE false
END AS is_favorite
from ${constant['DB_NAME']}.${constant['DB_TABLE']['USER_WEEK_DAY_MENUS']} uwdm
join ${constant['DB_NAME']}.${constant['DB_TABLE']['USER_WEEK_MENUS']} uwm on uwdm.week_menu_id = uwm.id
join ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPES']} r on r.id = uwdm.main_recipe_id
left join ${constant['DB_NAME']}.${constant['DB_TABLE']['NUTRITIONAL_PROFILE']} np on np.id = r.nutritional_profile_id
left join ${constant['DB_NAME']}.${constant['DB_TABLE']['FAVORITES']} f on f.user_id = uwm.user_id and r.id = f.recipe_id
where uwm.user_id = ${userId}`;

 const fetchSideRecipeQuery = (weekDayMenuId, userId) => `select r.*, r.id as recipe_id, np.*,
 CASE
   WHEN f.id is not null
   THEN true
   ELSE false
 END AS is_favorite
 from ${constant['DB_NAME']}.${constant['DB_TABLE']['USER_WEEK_DAY_MENUS']} uwdm
 join ${constant['DB_NAME']}.${constant['DB_TABLE']['USER_WEEK_MENUS']} uwm on uwdm.week_menu_id = uwm.id
 join ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPES']} r on (uwdm.first_side_recipe_id = r.id or uwdm.second_side_recipe_id = r.id)
 join  ${constant['DB_NAME']}.${constant['DB_TABLE']['NUTRITIONAL_PROFILE']} np on np.id = r.nutritional_profile_id
 left join ${constant['DB_NAME']}.${constant['DB_TABLE']['FAVORITES']} f on f.user_id = uwm.user_id and r.id = f.recipe_id
 where uwm.user_id = ${userId} and uwdm.id = ${weekDayMenuId}`;

const searchRecipeQuery = (storeId, userId, searchText, dishType, paginationObj) => {
    let query = `select distinct(r.id), r.name, r.protein_category, coalesce(pr.is_on_sale, 0) as is_on_sale
    from ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPES']} r
    left join ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPE_INGREDIENTS']} ri on ri.recipe_id = r.id
    left join (
        select distinct(ingredient_id), store_id, Max(is_on_sale) as is_on_sale
        from ${constant['DB_NAME']}.${constant['DB_TABLE']['PRICES']}  where store_id = ${storeId} and start_date <= CURDATE() AND stop_date >= CURDATE() group by ingredient_id
    ) pr on pr.ingredient_id = ri.ingredient_id
    where user_id ${userId === null ? 'is null' : '= ' +  userId} and r.name like '%${searchText}%' and r.dish_type = ${dishType}`;

    query += _orderQuery(paginationObj);
    return query;
}

const searchUserFavRecipeQuery = (storeId, userId, searchText, dishType, paginationObj) => {
    let query = `select distinct(r.id), r.name, r.protein_category, coalesce(pr.is_on_sale, 0) as is_on_sale
    from ${constant['DB_NAME']}.${constant['DB_TABLE']['FAVORITES']} f
    join ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPES']} r on f.recipe_id = r.id
    left join ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPE_INGREDIENTS']} ri on ri.recipe_id = r.id
    left join (
        select distinct(ingredient_id), store_id, Max(is_on_sale) as is_on_sale
        from ${constant['DB_NAME']}.${constant['DB_TABLE']['PRICES']}  where store_id = ${storeId} and start_date <= CURDATE() AND stop_date >= CURDATE() group by ingredient_id
    ) pr on pr.ingredient_id = ri.ingredient_id
    where f.user_id = ${userId} and r.name like '%${searchText}%' and r.dish_type = ${dishType}`;

    query += _orderQuery(paginationObj);
    return query;
}

const fetchShoppingIngredientForNewUser = (recipeIds = [], storeId) => `select
    coalesce(pr.is_on_sale, 0) as is_on_sale,
    ri.ingredient_id,
    ri.cooking_measurement_id as ingredient_measurement_id,
    sum(ri.amount) as amount,
    ri.is_optional,
    case when i.shopping_name is not null
    then i.shopping_name
    else i.name
    end as ingredient_name,
    i.shopping_category,
    im.name,
    count(*) as times_used,
    pr.brand1 as brand
    FROM ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPE_INGREDIENTS']} ri
    join ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPES']} r on r.id = ri.recipe_id
    join ${constant['DB_NAME']}.${constant['DB_TABLE']['INGREDIENTS']} i on i.id = ri.ingredient_id
    join ${constant['DB_NAME']}.${constant['DB_TABLE']['INGREDIENTS_MEASUREMENTS']} im on im.id = ri.cooking_measurement_id
    left join (
        select  distinct(ingredient_id), store_id, Max(is_on_sale) as is_on_sale, brand1
        from ${constant['DB_NAME']}.${constant['DB_TABLE']['PRICES']} where store_id = ${storeId} and start_date <= CURDATE() AND stop_date >= CURDATE() group by ingredient_id, brand1
      ) pr on pr.ingredient_id = ri.ingredient_id
    where ri.recipe_id in (${recipeIds.join(', ')}) group by pr.is_on_sale, ri.ingredient_id, cooking_measurement_id, is_optional, pr.brand1;`;

const fetchShoppingIngredient = (userId, storeId) => `select
    coalesce(pr.is_on_sale, 0) as is_on_sale,
    ri.ingredient_id,
    sl.id as shopping_list_id,
    ri.cooking_measurement_id as ingredient_measurement_id,
    sum(ri.amount) as amount,
    ri.is_optional,
    case when i.shopping_name is not null
    then i.shopping_name
    else i.name
    end as ingredient_name,
    i.shopping_category,
    im.name,
    count(*) as times_used,
    pr.brand1 as brand
 from ${constant['DB_NAME']}.${constant['DB_TABLE']['USER_WEEK_DAY_MENUS']} uwdm
 join ${constant['DB_NAME']}.${constant['DB_TABLE']['USER_WEEK_MENUS']} uwm on uwdm.week_menu_id = uwm.id
 join ${constant['DB_NAME']}.${constant['DB_TABLE']['SHOPPING_LISTS']} sl on uwm.id = sl.user_week_menu_id
 join ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPES']} r on (r.id = uwdm.main_recipe_id or r.id = uwdm.first_side_recipe_id or r.id = uwdm.second_side_recipe_id)
 join ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPE_INGREDIENTS']} ri on ri.recipe_id = r.id
 join ${constant['DB_NAME']}.${constant['DB_TABLE']['INGREDIENTS']} i on i.id = ri.ingredient_id
 join ${constant['DB_NAME']}.${constant['DB_TABLE']['INGREDIENTS_MEASUREMENTS']} im on im.id = ri.cooking_measurement_id
 left join (
    select  distinct(ingredient_id), store_id, Max(is_on_sale) as is_on_sale, brand1
    from ${constant['DB_NAME']}.${constant['DB_TABLE']['PRICES']} where store_id = ${storeId} and start_date <= CURDATE() AND stop_date >= CURDATE() group by ingredient_id, brand1
  ) pr on pr.ingredient_id = ri.ingredient_id
 where uwm.user_id = ${userId} group by pr.is_on_sale, ri.ingredient_id, cooking_measurement_id, is_optional, sl.id, pr.brand1;`;

 const deleteShoppingListItems = (userId) => `Delete from ${constant['DB_NAME']}.${constant['DB_TABLE']['SHOPPING_LIST_ITEMS']} sli
 where shopping_list_id in (select sl.id from ${constant['DB_NAME']}.${constant['DB_TABLE']['SHOPPING_LISTS']} sl
    join ${constant['DB_NAME']}.${constant['DB_TABLE']['USER_WEEK_MENUS']} uwm on  ${userId} = uwm.user_id
 where sl.user_week_menu_id = uwm.id)
 and dish_type != 0;`;

 const selectStoreQuery = (stateId) => `SELECT st.id, st.name FROM ${constant['DB_NAME']}.${constant['DB_TABLE']['STATE_STORE_MAPPING']} ss
 join ${constant['DB_NAME']}.${constant['DB_TABLE']['STORES']} st on ss.store_id = st.id where ss.state_id = ${stateId};`;

 const fetchStateStoreQuery = (storeId) => `SELECT st.id, st.name FROM ${constant['DB_NAME']}.${constant['DB_TABLE']['STATE_STORE_MAPPING']} ss
 join ${constant['DB_NAME']}.${constant['DB_TABLE']['STATES']} st on ss.state_id = st.id where ss.store_id = ${storeId};`;

const fetchStoreIngSaleQuery = (storeId) => `Select count(*) as total from ${constant['DB_NAME']}.${constant['DB_TABLE']['PRICES']} where store_id = ${storeId} and is_on_sale = 1 and start_date <= CURDATE() AND stop_date >= CURDATE()`;

const fetchStoreSpecialQuery = (storeId) => `select p.id, p.ingredient_id, p.created, p.is_on_sale, i.name from ${constant['DB_NAME']}.${constant['DB_TABLE']['PRICES']} p
    left join ${constant['DB_NAME']}.${constant['DB_TABLE']['INGREDIENTS']} i on  i.id = p.ingredient_id
    where p.store_id = ${storeId} and p.start_date <= CURDATE() AND p.stop_date >= CURDATE() order by is_on_sale desc;`;

const updateStoreSpecialQuery = (reqObj, storeId) => `UPDATE ${constant['DB_NAME']}.${constant['DB_TABLE']['PRICES']}
    SET updated = now(), is_on_sale = CASE
        ${reqObj.map(row => `WHEN id = ${row.id} THEN ${row.is_on_sale}`).join('\n')}
        ELSE is_on_sale
    END
    WHERE id IN (${reqObj.map(row => row.id).join(',')}) and store_id=${storeId}`;

const fetchUserDietPlanOptions = (userId) => `select name, dp.type,
    CASE
        WHEN dp.type = 'numeric' THEN udp.value
        WHEN dp.type = 'boolean' THEN udp.checked
    END AS value
    from ${constant['DB_NAME']}.${constant['DB_TABLE']['USER_DIET_PLAN_OPTIONS']} udp
    join ${constant['DB_NAME']}.${constant['DB_TABLE']['DIET_PLAN_OPTIONS']} dp on dp.id = udp.diet_plan_option_id
    where user_id = ${userId}`;

const fetchRecipesExceptNonSeasonal = (season) => {
    let query = `SELECT id FROM ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPES']} where dish_type = 1 and user_id is null and id not in
        (SELECT id FROM ${constant['DB_NAME']}.${constant['DB_TABLE']['RECIPES']} where `
        for (let i = 0; i < season.length; i++) {
            if (i === season.length - 1) {
                query += `tag_names like '%${season[i]}%')`;
            } else {
                query += `tag_names like '%${season[i]}%' or `;
            }
        }
    return query;
};

// select distinct(id) from dinnerdaily.recipes where id in (968, 1, 5, 7, 10) and id not in (select recipe_id from dinnerdaily.recipeingredients where ingredient_id in (39));

module.exports = {
    selectQuery,
    insertQuery,
    deleteQuery,
    deleteMultipleQuery,
    updateQuery,
    fetchUserQuery,
    fetchUserForNotificationsQuery,
    updateWithDuplicateKeyQuery,
    fetchIngredientsQuery,
    updateWeekMenuQuery,
    fetchUserWeekMenuQuery,
    fetchSideRecipeQuery,
    searchQuery,
    searchRecipeQuery,
    searchUserFavRecipeQuery,
    fetchShoppingIngredientForNewUser,
    fetchShoppingIngredient,
    deleteShoppingListItems,
    adminDashBoardQuery,
    fetchAdminIngredientsQuery,
    selectStoreQuery,
    fetchStateStoreQuery,
    fetchAdminRecipeQuery,
    fetchSidesQuery,
    fetchStoreIngSaleQuery,
    fetchStoreSpecialQuery,
    updateStoreSpecialQuery,
    fetchUserDietPlanOptions,
    fetchRecipesExceptNonSeasonal
}
