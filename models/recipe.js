const rfr = require("rfr");
const constant = rfr("/shared/constant");
const utils = rfr("/shared/utils");
const pool = rfr("/db/index");
const dbQuery = rfr('/shared/query');
const helper = rfr("/shared/helper");


const _addingRecipeIngredients = async (data, user_id) => {
    const ingredientObj = {
        name: data?.name,
        plural_name: data?.name,
        is_staple: constant['DISABLED'],
        tier: 2,
        shopping_name: data?.name,
        status: constant['ENABLED'],
        shopping_category: data?.shopping_category || null,
        shopping_measurement_id: data?.cooking_measurement_id || null,
        created: helper.getDateAndTime(),
        user_id: user_id
    }
    try {
        const { columns, valuesArr } = utils.formatRequestDataForInsert([ingredientObj]);
        const insertQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['INGREDIENTS'], columns);
        const results = await pool.query(insertQueryParam, [valuesArr]);
        return results[0].insertId
    } catch (error) {
        utils.writeErrorLog('recipe ingredients', '_addingRecipeIngredients', 'Error while adding recipes ingredients data', error);
        throw error;
    }
}

// Function to format recipe ingredient to save in db
const _formatIngredientsData = async (ingredients, recipeId, userId, cond) => {
    let ingredientsArr = [];
    for (let i = 0; i < ingredients.length; i++) {
        const ele = ingredients[i];
        const ingreObj = {
            amount: ele?.amount || 0,
            ingredient_id: helper.notEmpty(ele?.name) ? await _addingRecipeIngredients(ele, userId) : ele.ingredient_id,
            position: ele?.position || 0,
            is_optional: ele?.is_optional || 0,
            cooking_measurement_id: ele?.cooking_measurement_id || null,
            is_round_up_for_half_family_size: ele?.is_round_up_for_half_family_size || 0,
            preparation: ele?.preparation || null,
            recipe_id: recipeId
        }
        if (ele?.id) {
            ingreObj.updated = helper.getDateAndTime();
        } else {
            ingreObj.created = helper.getDateAndTime();
        }
        if (ele?.rid && cond) {
            ingreObj.id = ele?.rid
        }
        ingredientsArr.push(ingreObj)
    }
    return ingredientsArr;
};

const _commonRecipeSides = async (sideData, side, combinationid) => {
    const { columns, valuesArr } = utils.formatRequestDataForInsert([{ side: side, recipe_side_combination_id: combinationid, created: helper.getDateAndTime() }]);
    const insertQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['RECIPE_SIDE_ITEMS'], columns);
    await pool.query(insertQueryParam, [valuesArr]).then(async (resp) => {
        const recipe_side_item_id = resp[0].insertId;
        for (let m = 0; m < sideData.length; m++) {
            const { columns, valuesArr } = utils.formatRequestDataForInsert([{ recipe_side_item_id: recipe_side_item_id, hash_tag_id: sideData[m] }]);
            const insertQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['CROSS_RECIPE_SIDE_ITEM_TAGS'], columns);
            await pool.query(insertQueryParam, [valuesArr]);
        }

    }).catch((error) => {
        utils.writeErrorLog('recipe', '_formatSidesData', 'Error while adding Recipe Side data', error);
        throw error;
    })
}


const _formatSidesData = async (sideData, recipeId) => {
    for (let i = 0; i < sideData.length; i++) {
        const { columns, valuesArr } = utils.formatRequestDataForInsert([{ recipe_id: recipeId, created: helper.getDateAndTime() }]);
        const insertQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['RECIPE_SIDE_COMBINATIONS'], columns);
        await pool.query(insertQueryParam, [valuesArr]).then(async (resp) => {
            const combinationid = resp[0].insertId;
            if (sideData[i]?.side_0?.length) {
                await _commonRecipeSides(sideData[i].side_0, 0, combinationid)
            }
            if (sideData[i]?.side_1?.length) {
                await _commonRecipeSides(sideData[i].side_1, 1, combinationid)
            }
        }).catch((error) => {
            utils.writeErrorLog('recipe', '_formatSidesData', 'Error while adding Recipe Side data', error);
            throw error;
        });
    }
}



const nutritionalProfile = async (npdata, id) => {
    const nutritionalProfileObj = { ...npdata }
    if (id) nutritionalProfileObj.updated = helper.getDateAndTime();
    else nutritionalProfileObj.created = helper.getDateAndTime();
    try {
        if (id) {
            const QueryParam = dbQuery.updateQuery(constant['DB_TABLE']['NUTRITIONAL_PROFILE'], nutritionalProfileObj, { id: id });
            await pool.query(QueryParam);
            return id;
        } else {
            const { columns, valuesArr } = utils.formatRequestDataForInsert([nutritionalProfileObj]);
            const QueryParam = dbQuery.insertQuery(constant['DB_TABLE']['NUTRITIONAL_PROFILE'], columns);
            const results = await pool.query(QueryParam, [valuesArr]);
            return results[0].insertId
        }
    } catch (error) {
        utils.writeErrorLog('nutritional Profile', 'nutritionalProfile', 'Error while adding nutritional Profile data', error);
        throw error;
    }
}

// Function to format Data to save in db
const _formatData = async (data, id) => {
    const updateObj = (({ ingredients, nutritional, sides, tag_ids, ...other }) => other)(data) // remove ingredients key
    const dataObj = { ...updateObj }
    if (data?.user_id === null && data?.nutritional) {
        dataObj.nutritional_profile_id = await nutritionalProfile(data?.nutritional, data?.nutritional_profile_id)
    }
    if (id) dataObj.updated = helper.getDateAndTime();
    else dataObj.created = helper.getDateAndTime();

    return dataObj;
}

const _recipeDefaultValues = (req, data) => {
    data['instructions'] = data['instructions'] || 'null';
    data['is_tested'] = data['is_tested'] || 0;
    data['is_ok_for_half'] = data['is_ok_for_half'] || 0;
    data['dish_type'] = data['dish_type'] || constant['DISH_TYPE'];
    data['status'] = req.query.isOwnRecipe ? constant['DISH_STATUS'] : data['status']
    data['number_of_servings'] = data['number_of_servings'] || 0;
    data['slug'] = (data['name'].toLowerCase().split(' ')).join('-');
    data['user_id'] = req.query.isOwnRecipe ? req.userData.id : null;
    return data
}

// Functions for update ingredients data
const _updateIngredientData = async (ingredients) => {
    for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].id === 'new') {
            const updateObj = (({ id, ...other }) => other)(ingredients[i])
            const { columns, valuesArr } = utils.formatRequestDataForInsert([updateObj]);
            const QueryParam = dbQuery.insertQuery(constant['DB_TABLE']['RECIPE_INGREDIENTS'], columns);
            await pool.query(QueryParam, [valuesArr]);
        } else {
            const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['RECIPE_INGREDIENTS'], ingredients[i], { id: ingredients[i].id });
            await pool.query(updateQueryParam);
        }
    }
}

// Function to fetch recipe ingredients
const _fetchRecipeIngredients = async (recipesData) => {
    let promiseArr = [];
    for (let i = 0; i < recipesData.length; i++) {
        let recipeId = recipesData[i]['recipe_id'] || recipesData[i]['id'];
        let queryParam = dbQuery.fetchIngredientsQuery(recipeId);
        promiseArr.push(pool.query(queryParam));
    }

    return await Promise.all(promiseArr).then((res) => {
        recipesData.forEach((recipe, index) => {
            recipe['ingredients'] = res[index].length ? res[index][0] : [];
        });
        return recipesData;
    }).catch(err => {
        utils.writeErrorLog('recipe', '_fetchRecipeIngredients', 'Error while fetching recipes ingredients data', err);
        throw err;
    });
}

// Function to fetch recipe side dish
const _fetchRecipeSides = async (recipesData, userId) => {
    utils.writeInsideFunctionLog("recipe", "_fetchRecipeSides", recipesData);

    let promiseArr = [];
    for (let i = 0; i < recipesData.length; i++) {
        if (!!recipesData[i]['week_day_menu_id']) {
            let weekDayMenuId = recipesData[i]['week_day_menu_id'];
            let queryParam = dbQuery.fetchSideRecipeQuery(weekDayMenuId, userId);
            promiseArr.push(pool.query(queryParam));
        }
    }

    if (promiseArr.length) {
        return await Promise.all(promiseArr).then(async (res) => {
            for (let i = 0; i < recipesData.length; i++) {
                if (res[i][0].length) {
                    const sideRecipeWithIngredients = await _fetchRecipeIngredients(res[i][0]);
                    recipesData[i]['sides'] = sideRecipeWithIngredients;
                } else {
                    recipesData[i]['sides'] = [];
                }
            }
            return recipesData;
        }).catch(err => {
            utils.writeErrorLog('recipe', '_fetchRecipeSides', 'Error while fetching side recipes data', err);
            throw err;
        });
    }
    return recipesData;
}

const _fetchAndFormatRecIngredients = async (userId, storeId) => {
    //fetch data for shopping list item
    let selectQueryParam = dbQuery.fetchShoppingIngredient(userId, storeId);
    const [rows] = await pool.query(selectQueryParam);
    rows.forEach(row => {
        row['type'] = 1;
        row['created'] = helper.getDateAndTime();
        row['checked_off'] = 0;
        row['dish_type'] = 1;
        row['is_on_sale'] = row['is_on_sale'] || 0;
        row['shopping_list_id'] = row['shopping_list_id'];
        row['formatted_amount'] = `${utils.formatAmount(row['amount'])}${row['name']}`;
        delete row['name'];
    });
    // insert data in shopping list items table
    let { columns: shoppingListItemsColumns, valuesArr: shoppingListItemsValuesArr } = utils.formatRequestDataForInsert(rows);
    const shoppingListItemsQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['SHOPPING_LIST_ITEMS'], shoppingListItemsColumns);
    return { shoppingListItemsQueryParam, shoppingListItemsValuesArr };
}

//Common function to fetch recipes their ingredients and side recipes from database
const _fetchRecipes = async (queryParam, userId) => {
    utils.writeInsideFunctionLog("recipe", "_fetchRecipes");
    return await pool.query(queryParam).then(async (results) => {
        const recipesData = results[0];
        const recipeWithIngredients = await _fetchRecipeIngredients(recipesData);
        const recipeWithSides = await _fetchRecipeSides(recipeWithIngredients, userId);
        return recipeWithSides;
    }).catch((error) => {
        utils.writeErrorLog('recipe', '_fetchRecipes', 'Error while fetching recipes and their ingredients and side data', error, queryParam);
        throw error;
    });
}


const _deleteRecipeSide = async (recipeId, queryData) => {
    try {
        const queryParamFirstTable = dbQuery.deleteQuery(constant['DB_TABLE']['RECIPE_SIDE_COMBINATIONS'], { recipe_id: recipeId });
        await pool.query(queryParamFirstTable).then(async (resp) => {
            const recipe_side_combination_id = queryData?.rscid?.split(",");
            const queryParamSecondTable = dbQuery.deleteMultipleQuery(constant['DB_TABLE']['RECIPE_SIDE_ITEMS'], 'recipe_side_combination_id', recipe_side_combination_id);
            await pool.query(queryParamSecondTable).then(async (resp) => {
                const recipe_side_item_id = queryData?.rsid?.split(",");
                const queryParamThirdTable = dbQuery.deleteMultipleQuery(constant['DB_TABLE']['CROSS_RECIPE_SIDE_ITEM_TAGS'], 'recipe_side_item_id', recipe_side_item_id);
                await pool.query(queryParamThirdTable);
            }).catch((error) => {
                utils.writeErrorLog('recipe', '_deleteRecipeSide', 'Error while deleting recipes cross recipe side item tags data', error);
                resObj['message'] = constant['OOPS_ERROR'];
                resObj['data'] = error.message || error;
                cb(resObj);
            })
        }).catch((error) => {
            utils.writeErrorLog('recipe', '_deleteRecipeSide', 'Error while deleting  recipe side items data', error);
            resObj['message'] = constant['OOPS_ERROR'];
            resObj['data'] = error.message || error;
            cb(resObj);
        })
    } catch (error) {
        utils.writeErrorLog('recipe', '_deleteRecipeSide', 'Error while deleting recipes side data', error);
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = error.message || error;
        cb(resObj);
    }
}

// Function for get api for Recipe
const getAllRecipe = async (req, res, cb) => {
    utils.writeInsideFunctionLog("recipe", "getAllRecipe");
    const userId = req.userData.id;
    let resObj = Object.assign({}, utils.getErrorResObj());
    const paginationObj = helper.getPagination(req.query?.page, req.query?.pageSize, req.query?.sortField, req.query?.sortValue);
    let queryParam = dbQuery.selectQuery(constant['DB_TABLE']['RECIPES'], [], {}, paginationObj);
    try {
        const recipesData = await _fetchRecipes(queryParam, userId);
        resObj = Object.assign({ data: recipesData }, utils.getSuccessResObj());
        cb(resObj);
    } catch (err) {
        utils.writeErrorLog('recipe', 'getAllRecipe', 'Error while fetching recipes data', err, queryParam);
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = err.message || err;
        cb(resObj);
    };
}

// Function for add api for Recipe
const addRecipe = async (req, res, cb) => {
    utils.writeInsideFunctionLog("recipes", "addRecipe", req.body);
    const defaultData = _recipeDefaultValues(req, req.body);
    let data = { ...req.body, ...defaultData }
    resObj = Object.assign({}, utils.getErrorResObj());
    try {
        if (!!data.name) {
            const formatInsertData = await _formatData(data);
            const { columns, valuesArr } = utils.formatRequestDataForInsert([formatInsertData]);
            const insertQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['RECIPES'], columns);
            pool.query(insertQueryParam, [valuesArr]).then(async (resp) => {
                let ingredientsArr = [];
                if (data?.ingredients && data?.ingredients.length) {
                    ingredientsArr = await _formatIngredientsData(data.ingredients, resp[0].insertId, req.userData.id);
                    const { columns, valuesArr } = utils.formatRequestDataForInsert(ingredientsArr);
                    const insertQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['RECIPE_INGREDIENTS'], columns);
                    await pool.query(insertQueryParam, [valuesArr]);
                }
                if (data.sides && data.sides.length) {
                    await _formatSidesData(data?.sides, resp[0].insertId);
                }
                resObj = Object.assign({ data: { ...formatInsertData, id: resp[0].insertId, ingredientsArr } }, utils.getSuccessResObj());
                resObj['message'] = constant['SUCCESS_MSG'];
                cb(resObj);
            }).catch((error) => {
                resObj['message'] = constant['OOPS_ERROR'];
                resObj['data'] = error.message || error;
                utils.writeErrorLog('recipe', 'addRecipe', 'Error while adding new recipe', error);
                cb(resObj);
            })
        } else {
            resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
            cb(resObj);
        }
    } catch (err) {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = err.message || err;
        utils.writeErrorLog('recipe', 'addRecipe', 'Error while adding new recipe and ingredients', err);
        cb(resObj);
    }
}

// Function for update api for Recipe
const updateRecipe = async (req, res, cb) => {
    utils.writeInsideFunctionLog("recipe", "Update Recipe", req.body);
    let id = req.params.id;
    const defaultData = _recipeDefaultValues(req, req.body);
    let data = { ...req.body, ...defaultData }
    resObj = Object.assign({}, utils.getErrorResObj());
    try {
        if (!!data.name) {
            const formatData = await _formatData(data, id);
            const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['RECIPES'], formatData, { id: id });
            await pool.query(updateQueryParam).then(async (resp) => {
                let ingredientsArr = []
                if (data?.ingredients && data?.ingredients.length) {
                    ingredientsArr = await _formatIngredientsData(data.ingredients, id, '', true);
                    await _updateIngredientData(ingredientsArr);
                }
                if (data?.sides.length) {
                    if (req.query?.rscid && req.query?.rsid) {
                        await _deleteRecipeSide(id, req.query);
                    }
                    await _formatSidesData(data?.sides, id);
                }
                resObj = Object.assign({ data: { ...formatData, ingredientsArr } }, utils.getSuccessResObj());
                resObj['message'] = constant['UPDATE_SUCCESS_MSG'];
                cb(resObj);
            }).catch((error) => {
                resObj['message'] = constant['OOPS_ERROR'];
                resObj['data'] = error.message || error;
                cb(resObj);
            })
        } else {
            resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
            cb(resObj);
        }
    } catch (err) {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = err.message || err;
        utils.writeErrorLog('recipe', 'addRecipe', 'Error while adding new recipe and ingredients', err);
        cb(resObj);
    }

}

// Function for Delete api for Recipe
const deleteRecipe = async (req, res, cb) => {
    utils.writeInsideFunctionLog("recipe", "Delete Recipe");
    let id = req.params.id;
    resObj = Object.assign({}, utils.getErrorResObj());
    if (helper.notEmpty(id)) {
        const QueryParam = dbQuery.deleteQuery(constant['DB_TABLE']['RECIPES'], { id: id });
        await pool.query(QueryParam).then(async (resp) => {
            const queryParamIngredient = dbQuery.deleteQuery(constant['DB_TABLE']['RECIPE_INGREDIENTS'], { recipe_id: id });
            await pool.query(queryParamIngredient);
            if (req.query?.rscid && req.query?.rsid) {
                await _deleteRecipeSide(id, req.query);
            }
            resObj = Object.assign({}, utils.getSuccessResObj());
            resObj['message'] = constant['DELETE_SUCCESS_MSG'];
            cb(resObj);
        }).catch((error) => {
            resObj['message'] = constant['OOPS_ERROR'];
            resObj['data'] = error.message || error;
            cb(resObj);
        })
    } else {
        resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
        cb(resObj);
    }
}

//Function to give user week menu
const weekMenu = async (req, res, cb) => {
    utils.writeInsideFunctionLog("recipe", "weekMenu");
    let resObj = Object.assign({}, utils.getErrorResObj());
    try {
        let userId = req.userData.id;
        let queryParam = dbQuery.fetchUserWeekMenuQuery(userId);
        const recipesData = await _fetchRecipes(queryParam, userId);
        let resObj = Object.assign({ data: recipesData }, utils.getSuccessResObj());
        cb(resObj);
    } catch (err) {
        utils.writeErrorLog('recipe', 'weekMenu', 'Error while getting user week menu', err);
        resObj['data'] = err.message || err;
        cb(resObj);
    }
}

//Function to mark a recipe as favorite
const addFavorite = (req, res, cb) => {
    utils.writeInsideFunctionLog("recipe", "addFavorite");
    const recipeId = req.params.id;
    let resObj = Object.assign({}, utils.getErrorResObj());
    if (recipeId) {
        const reqData = {
            'created': helper.getDateAndTime(),
            'user_id': req.userData.id,
            'recipe_id': recipeId
        }
        const { columns, valuesArr } = utils.formatRequestDataForInsert([reqData]);
        const queryParam = dbQuery.insertQuery(constant['DB_TABLE']['FAVORITES'], columns);
        pool.query(queryParam, [valuesArr])
            .then(resp => {
                resObj = Object.assign({}, utils.getSuccessResObj());
                cb(resObj);
            }).catch(err => {
                resObj['message'] = constant['OOPS_ERROR'];
                resObj['data'] = err.message || err;
                utils.writeErrorLog('recipe', 'addFavorite', 'Error while saving recipe in favorite table', err, queryParam);
                cb(resObj);
            });
    } else {
        resObj['message'] = constant['MISSING_ID_ERROR'];
        cb(resObj);
    }
}

//Function to unmark a recipe as favorite
const removeFavorite = (req, res, cb) => {
    utils.writeInsideFunctionLog("recipe", "removeFavorite");
    const recipeId = req.params.id;
    let resObj = Object.assign({}, utils.getErrorResObj());
    if (recipeId) {
        const queryParam = dbQuery.deleteQuery(constant['DB_TABLE']['FAVORITES'], { 'user_id': req.userData.id, 'recipe_id': recipeId });
        pool.query(queryParam)
            .then(resp => {
                resObj = Object.assign({}, utils.getSuccessResObj());
                cb(resObj);
            }).catch(err => {
                resObj['message'] = constant['OOPS_ERROR'];
                resObj['data'] = err.message || err;
                utils.writeErrorLog('recipe', 'removeFavorite', 'Error while removing recipe from favorite table', err, queryParam);
                cb(resObj);
            });
    } else {
        resObj['message'] = constant['MISSING_ID_ERROR'];
        cb(resObj);
    }
}

//Function to change user menu recipe with selected recipe
const updateUserWeekRecipe = async (req, res, cb) => {
    utils.writeInsideFunctionLog("recipe", "updateUserWeekRecipe", req.query);
    const weekDayMenuId = req.params.id;
    const newRecipeId = req.query.id || null;
    let resObj = Object.assign({}, utils.getErrorResObj());
    if (weekDayMenuId) {
        try {
            const userId = req.userData.id;
            const storeId = req.userData.preferred_store_id;
            let firstSideDish = req.query.firstSideDish || '';
            let secSideDish = req.query.secSideDish || '';
            const recipeType = !!firstSideDish ? 'first_side_recipe_id' : (!!secSideDish ? 'second_side_recipe_id' : 'main_recipe_id');
            let queryParam = dbQuery.updateWeekMenuQuery(userId, recipeType, weekDayMenuId, newRecipeId);
            // update user recipe
            await pool.query(queryParam);
            const conn = await pool.getConnection();
            await conn.query('START TRANSACTION');
            queryParam = dbQuery.deleteShoppingListItems(userId);
            return conn.query(queryParam)
                .then(async res => {
                    let { shoppingListItemsQueryParam, shoppingListItemsValuesArr } = await _fetchAndFormatRecIngredients(userId, storeId);
                    return await conn.query(shoppingListItemsQueryParam, [shoppingListItemsValuesArr]);
                }).then(async resp => {
                    await conn.query('COMMIT');
                    await conn.release();
                    resObj = Object.assign({}, utils.getSuccessResObj());
                    cb(resObj);
                })
                .catch(async err => {
                    await conn.query('ROLLBACK');
                    await conn.release();
                    utils.writeErrorLog('recipe', 'updateUserWeekRecipe', 'Error while deleting and adding ingredients in shopping list table', err, queryParam);
                    resObj['message'] = err.message || err;
                    cb(resObj);
                });
        } catch (error) {
            utils.writeErrorLog('recipe', 'updateUserWeekRecipe', 'Error while updating recipe in user week menu table', error);
            resObj['message'] = error.message || error;
            cb(resObj);
        }
    } else {
        resObj['message'] = constant['MISSING_ID_ERROR'];
        cb(resObj);
    }
}

//Function to give user week menu
const userRecipes = async (req, res, cb) => {
    utils.writeInsideFunctionLog("recipe", "userRecipes");
    let resObj = Object.assign({}, utils.getErrorResObj());
    try {
        let userId = req.userData.id;
        const paginationObj = helper.getPagination(req.query?.page, req.query?.pageSize, req.query?.sortField, req.query?.sortValue);
        let queryParam = dbQuery.selectQuery(constant['DB_TABLE']['RECIPES'], ['id', 'name'], { user_id: userId }, paginationObj);
        const recipesData = await _fetchRecipes(queryParam, userId);
        let resObj = Object.assign({ data: recipesData }, utils.getSuccessResObj());
        cb(resObj);
    } catch (err) {
        utils.writeErrorLog('recipe', 'userRecipes', 'Error while fetching user recipes', err);
        resObj['data'] = err.message || err;
        cb(resObj);
    }
}

//Function to give user week menu
const searchRecipe = async (req, res, cb) => {
    utils.writeInsideFunctionLog("recipe", "searchRecipe", req.query);
    let resObj = Object.assign({}, utils.getErrorResObj());
    const storeId = req.userData.preferred_store_id;
    const searchText = req.query.text || '';
    const searchType = req.query.type || 'all';
    const dishType = req.query.dishType || 1;
    const userId = searchType === 'personal' ? req.userData.id : null;
    const paginationObj = helper.getPagination(req.query?.page, req.query?.pageSize, req.query?.sortField, req.query?.sortValue);
    let queryParam = dbQuery.searchRecipeQuery(storeId, userId, searchText, dishType, paginationObj);
    if (searchType === 'favorite') {
        queryParam = dbQuery.searchUserFavRecipeQuery(storeId, req.userData.id, searchText, dishType, paginationObj);
    }
    pool.query(queryParam)
    .then(([resp]) => {
        const uniqueIds = [];
        const respArr = [];

        resp.forEach(item => {
        if (!uniqueIds.includes(item.id)) {
            uniqueIds.push(item.id);
            respArr.push(item);
        } else {
            const existingItem = respArr.find(i => i.id === item.id);
            if (existingItem.is_on_sale === 0 && item.is_on_sale === 1) {
            existingItem.is_on_sale = 1;
            }
        }
        });
        resObj = Object.assign({data: respArr}, utils.getSuccessResObj());
        cb(resObj);
    }).catch(err => {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = err.message || err;
        utils.writeErrorLog('recipe', 'searchRecipe', 'Error while fetching recipes', err);
        cb(resObj);
    });
}

//Function to fetch recipe image from firebase
const recipeImage = async (req, res, cb) => {
    const recipeId = req.params.id;
    utils.writeInsideFunctionLog("recipe", "recipeImage", recipeId);
    let resObj = Object.assign({}, utils.getErrorResObj());

    let queryParam = dbQuery.selectQuery(constant['DB_TABLE']['RECIPES'], ['media_id'], {id: recipeId});
    pool.query(queryParam)
    .then(async ([resp]) => {
        if (resp.length) {
            const filename = `recipeImages/thumb_${resp[0].media_id}_recipe_large.jpeg`;
            let url = await utils.getSignedURLFromFirebase(filename);
            resObj = Object.assign({data: {url}}, utils.getSuccessResObj());
            cb(resObj);
        } else {
            resObj = Object.assign({}, utils.getSuccessResObj());
            resObj['message'] = constant['RES_OBJ']['MSG']['NOT_FOUND'];
            resObj['code'] = constant['RES_OBJ']['CODE']['NOT_FOUND'];
            cb(resObj);
        }
    }).catch(err => {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = err.message || err;
        utils.writeErrorLog('recipe', 'recipeImage', 'Error while fetching recipe image from firebase', err);
        cb(resObj);
    });
}

//Function to add/update recipe notes
const updateRecipeNotes = async (req, res, cb) => {
    const recipeId = req.params.id;
    utils.writeInsideFunctionLog("recipe", "recipeImage", recipeId);
    let resObj = Object.assign({}, utils.getErrorResObj());

    let queryParam = dbQuery.updateQuery(constant['DB_TABLE']['RECIPES'], {notes: req.body.notes || ''}, {id: recipeId});
    pool.query(queryParam)
    .then(async ([resp]) => {
        resObj = Object.assign({}, utils.getSuccessResObj());
        cb(resObj);
    }).catch(err => {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = err.message || err;
        utils.writeErrorLog('recipe', 'updateRecipeNotes', 'Error while updating recipe notes in database', err);
        cb(resObj);
    });
}

module.exports = {
    getAllRecipe,
    addRecipe,
    weekMenu,
    addFavorite,
    removeFavorite,
    updateRecipe,
    deleteRecipe,
    updateUserWeekRecipe,
    userRecipes,
    searchRecipe,
    recipeImage,
    updateRecipeNotes
}