const rfr = require("rfr");
const constant = rfr("/shared/constant");
const utils = rfr("/shared/utils");
const pool = rfr("/db/index");
const dbQuery = rfr('/shared/query');
const helper = rfr("/shared/helper");


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


// Function to fetch recipe side
const _fetchRecipeSides = async (recipesData) => {
    let promiseArr = [];
    for (let i = 0; i < recipesData.length; i++) {
        let recipeId = recipesData[i]['id'];
        let queryParam = dbQuery.fetchSidesQuery(recipeId);
        promiseArr.push(pool.query(queryParam));
    }
    return await Promise.all(promiseArr).then((res) => {
        recipesData.forEach((recipe, index) => {
            recipe['sides'] = res[index].length ? res[index][0] : [];
        });
        return recipesData;
    }).catch(err => {
        utils.writeErrorLog('recipe', '_fetchRecipeSides', 'Error while fetching recipes sides data', err);
        throw err;
    });
}

//Common function to fetch recipes their ingredients and side recipes from database
const _fetchRecipes = async (queryParam) => {
    utils.writeInsideFunctionLog("recipe", "_fetchRecipes");
    return await pool.query(queryParam).then(async (results) =>{
        const recipesData = results[0];
        await _fetchRecipeIngredients(recipesData);
        const recipeWithSide = await _fetchRecipeSides(recipesData);
        return recipeWithSide;
    }).catch((error) => {
        utils.writeErrorLog('recipe', '_fetchRecipes', 'Error while fetching recipes and their ingredients and side data', error, queryParam);
        throw  error;
    });
}

// Function for get api for Recipe
const getAllRecipe = async(req, res, cb) => {
    utils.writeInsideFunctionLog("recipe", "getAllRecipe");
    let resObj = Object.assign({}, utils.getErrorResObj());
    const paginationObj = helper.getPagination(req.query?.page, req.query?.pageSize, req.query?.sortField, req.query?.sortValue);
    const whereCondition = {'status !':3}
    let queryParam = dbQuery.fetchAdminRecipeQuery(whereCondition, paginationObj);
    try {
        const recipesData = await _fetchRecipes(queryParam);
        const selectQuery = dbQuery.selectQuery(constant['DB_TABLE']['RECIPES'],["count(*) as total_items"],whereCondition,{})
        const resultData = await pool.query(selectQuery);
        const total_item = resultData[0];
        const responseData = recipesData.map((resp)=>{
            const updateObj = (({user_id,...other }) => other)(resp)
            return updateObj
        })
        resObj = Object.assign({data: responseData,...total_item[0]}, utils.getSuccessResObj());
        cb(resObj);
    } catch (error) {
        utils.writeErrorLog('recipe', 'getAllRecipe', 'Error while fetching recipes data', error, queryParam);
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = error.message || error;
        cb(resObj);
    };
}

// Function for Delete Recipe Ingredients api
const deleteRecipeIngredient = async (req, res, cb)=>{
    utils.writeInsideFunctionLog("recipe", "Delete Recipe ingredient");
    let id = req.params.id;
    resObj = Object.assign({}, utils.getErrorResObj());
    if(helper.notEmpty(id)){
     const queryParam = dbQuery.deleteQuery(constant['DB_TABLE']['RECIPE_INGREDIENTS'], {id:id});
     await pool.query(queryParam).then((resp)=>{
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj['message'] = constant['DELETE_SUCCESS_MSG'];
        cb(resObj);
     }).catch((error)=>{
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = error.message || error;
        cb(resObj);
     })
    }else{
        resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
		cb(resObj);
    }
}

module.exports ={
    getAllRecipe,
    deleteRecipeIngredient
}