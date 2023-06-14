const rfr = require("rfr");
const constant = rfr("/shared/constant");
const utils = rfr("/shared/utils");
const pool = rfr("/db/index");
const dbQuery = rfr('/shared/query');
const helper = rfr("/shared/helper");

// Function to format ingredient to save in db
const _formatData = (data,id) => {
    const dataObj = {...data}
    if(id){
        dataObj.updated= helper.getDateAndTime();
    }else{
        dataObj.created=helper.getDateAndTime();
    }
    return dataObj;
}

// Function for get api for ingredients
const getAllIngredient = async(req, res, cb)=>{
    utils.writeInsideFunctionLog("ingredient", "getAllIngredient");
    let resObj = Object.assign({}, utils.getErrorResObj());
    const searchText = req.query.search || '';
    const paginationObj = helper.getPagination(req.query?.page, req.query?.pageSize, req.query?.sortField, req.query?.sortValue);
    const queryParam = dbQuery.searchQuery(constant['DB_TABLE']['INGREDIENTS'], 'name', searchText, [], {}, paginationObj);
     await pool.query(queryParam).then((results)=>{
        resObj = Object.assign({data: results[0]}, utils.getSuccessResObj());
        cb(resObj);
     }).catch((error)=>{
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = error.message || error;
        cb(resObj);
     })
}

// Function for add api for ingredients
const addIngredient = async (req, res, cb)=>{
    utils.writeInsideFunctionLog("ingredient", "Add Ingredient");
	let data = req.body;
    resObj = Object.assign({}, utils.getErrorResObj());
    if(helper.notEmpty(data.name) && helper.notEmpty(data.status) && helper.notEmpty(data.tier)){
     const formatInsertData = _formatData(data);
     const { columns, valuesArr } = utils.formatRequestDataForInsert([formatInsertData]);
     const insertQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['INGREDIENTS'], columns);
      await pool.query(insertQueryParam,[valuesArr]).then((resp)=>{
        const responseData = {...formatInsertData,id:resp[0].insertId};
        resObj = Object.assign({data: responseData}, utils.getSuccessResObj());
        resObj['message'] = constant['SUCCESS_MSG'];
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

// Function for update api for ingredients
const updateIngredient = async (req, res, cb)=>{
    utils.writeInsideFunctionLog("ingredient", "Update Ingredient");
	let data = req.body;
    let id = req.params.id;
    resObj = Object.assign({}, utils.getErrorResObj());
    if(helper.notEmpty(data.name) && helper.notEmpty(data.status) && helper.notEmpty(data.tier) && helper.notEmpty(id)){
     const formatData = _formatData(data, id);
     const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['INGREDIENTS'], formatData, {id:id});
     await pool.query(updateQueryParam).then((resp)=>{
        resObj = Object.assign({data: {...formatData}}, utils.getSuccessResObj());
        resObj['message'] = constant['UPDATE_SUCCESS_MSG'];
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

// Function for Delete api for ingredients
const deleteIngredient = async (req, res, cb)=>{
    utils.writeInsideFunctionLog("ingredient", "Delete Ingredient");
    let id = req.params.id;
    resObj = Object.assign({}, utils.getErrorResObj());
    if(helper.notEmpty(id)){
     const queryParam = dbQuery.deleteQuery(constant['DB_TABLE']['INGREDIENTS'], {id:id});
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

//Function to get ingredient measurements unit list
const ingredientUnits = async(req, res, cb)=>{
    utils.writeInsideFunctionLog("ingredient", "ingredientUnits");
    let resObj = Object.assign({}, utils.getErrorResObj());
    const queryParam = dbQuery.selectQuery(constant['DB_TABLE']['INGREDIENTS_MEASUREMENTS'], ['id', 'name']);
     await pool.query(queryParam).then((results)=>{
        resObj = Object.assign({data: results[0]}, utils.getSuccessResObj());
        cb(resObj);
     }).catch((error)=>{
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = error.message || error;
        cb(resObj);
     })
}

module.exports = {
	getAllIngredient,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    ingredientUnits
}