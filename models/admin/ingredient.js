const rfr = require("rfr");
const constant = rfr("/shared/constant");
const utils = rfr("/shared/utils");
const pool = rfr("/db/index");
const dbQuery = rfr('/shared/query');
const helper = rfr("/shared/helper");


// Function to format ingredient category to save in db
const _formatData = (data,id) => {
   const dataObj = {
      ...data,
      parentId: data?.parentId || null,
   }
   if (id) {
       dataObj.updated = helper.getDateAndTime();
   } else {
       dataObj.created = helper.getDateAndTime();
   }
   return dataObj;
}


// Function for get api for ingredients
const getAllIngredient = async(req, res, cb)=>{
    utils.writeInsideFunctionLog("Admin ingredient", "getAllIngredient");
    let resObj = Object.assign({}, utils.getErrorResObj());
    const paginationObj = helper.getPagination(req.query?.page, req.query?.pageSize,req.query?.sortField,req.query?.sortValue);
    let queryParam
    if(req.query.name)
    queryParam = dbQuery.searchQuery(constant['DB_TABLE']['INGREDIENTS'], 'name', req.query.name, ['id', 'name'], { user_id: null}, paginationObj);
    else 
    queryParam = dbQuery.fetchAdminIngredientsQuery(paginationObj,{ user_id: null});
    await pool.query(queryParam).then(async (results)=>{
            const selectQuery = dbQuery.selectQuery(constant['DB_TABLE']['INGREDIENTS'],["count(*) as total_items"],{ user_id: null},{}) 
            const resultData = await pool.query(selectQuery);
            const total_items = req.query.name ? results[0].length :resultData[0][0].total_items;
            resObj = Object.assign({data: results[0],total_items}, utils.getSuccessResObj());
            cb(resObj); 
     }).catch((error)=>{
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = error.message || error;
        cb(resObj);
     })
}

// Function to fetch ingredient categories
const ingredientCategory = async (req, res, cb) => {
	utils.writeInsideFunctionLog('ingredient', 'ingredientCategory');
    let resObj = Object.assign({}, utils.getErrorResObj());
    const queryParam = dbQuery.selectQuery(constant['DB_TABLE']['INGREDIENTS_CATEGORY'], ['id', 'name','parentId'],{});
      await pool.query(queryParam).then(resp => {
         resObj = Object.assign({data: resp[0]}, utils.getSuccessResObj());
         cb(resObj);
      }).catch(err => {
         resObj['message'] = constant['OOPS_ERROR'];
         resObj['date'] = err.message || err;
         utils.writeErrorLog('ingredient', 'ingredientCategory', 'Error while fetching ingredient categories data', err);
         cb(resObj);
      });
}

// Function to fetch tags
const getAllTags = async (req, res, cb) => {
	utils.writeInsideFunctionLog('ingredient', 'tags');
    let resObj = Object.assign({}, utils.getErrorResObj());
    const whereCondition = {type:req.query.type}
    const queryParam = dbQuery.selectQuery(constant['DB_TABLE']['HASH_TAGS'], ['id', 'name','type'],whereCondition);
      await pool.query(queryParam).then(resp => {
         resObj = Object.assign({data: resp[0]}, utils.getSuccessResObj());
         cb(resObj);
      }).catch(err => {
         resObj['message'] = constant['OOPS_ERROR'];
         resObj['date'] = err.message || err;
         utils.writeErrorLog('ingredient', 'getAllTags', 'Error while fetching getAllTags data', err);
         cb(resObj);
      });
}


// Function for add api for ingredients category
const addIngredientCategory = async (req, res, cb)=>{
   utils.writeInsideFunctionLog("ingredient", "Add Ingredient category",);
   resObj = Object.assign({}, utils.getErrorResObj());
   if(helper.notEmpty(req.body.name)){
    const formatInsertData = _formatData(req.body);
    const { columns, valuesArr } = utils.formatRequestDataForInsert([formatInsertData]);
    const insertQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['INGREDIENTS_CATEGORY'], columns);
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

// Function for update api for ingredients category
const updateIngredientCategory = async (req, res, cb)=>{
   utils.writeInsideFunctionLog("ingredient", "Update Ingredient Category",);
   let data = req.body;
   let id = req.params.id;
   resObj = Object.assign({}, utils.getErrorResObj());
   if(helper.notEmpty(data.name) && helper.notEmpty(id)){
    const formatData = _formatData(data, id);
    const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['INGREDIENTS_CATEGORY'], formatData, {id:id});
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

// Function for Delete api for ingredients category
const deleteIngredientCategory = async (req, res, cb)=>{
   utils.writeInsideFunctionLog("ingredient", "Delete Ingredient category");
   let id = req.params.id;
   resObj = Object.assign({}, utils.getErrorResObj());
   if(helper.notEmpty(id)){
    const queryParam = dbQuery.deleteQuery(constant['DB_TABLE']['INGREDIENTS_CATEGORY'], {id:id});
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


module.exports = {
	getAllIngredient,
   ingredientCategory,
   deleteIngredientCategory,
   updateIngredientCategory,
   addIngredientCategory,
   getAllTags
}