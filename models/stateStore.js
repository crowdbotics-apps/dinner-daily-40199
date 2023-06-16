const rfr = require('rfr');

const pool = rfr('/db/index');

const constant = rfr('/shared/constant');
const utils = rfr('/shared/utils');
const helper = rfr('/shared/helper');
const dbQuery = rfr('/shared/query');


const _formateStoreData = (reqBody,id)=>{
    const updateObj = (({ state, ...other }) => other)(reqBody)
    const storeObj = {
        ...updateObj,
        parent_id: null,
        fulfillment_service: 0
    }
    if(id){
        storeObj.updated = helper.getDateAndTime();
    }else{
        storeObj.created = helper.getDateAndTime();
    }
    return storeObj;

}

// Function to fetch State list
const getStates = (req, res, cb) => {
	utils.writeInsideFunctionLog('stateStore', 'getStates');

	let resObj = Object.assign({}, utils.getErrorResObj());
    const queryParam = dbQuery.selectQuery(constant['DB_TABLE']['STATES'], ['id', 'name', 'abbr']);
	pool.query(queryParam)
    .then(resp => {
        resObj = Object.assign({data: resp[0]}, utils.getSuccessResObj());
        cb(resObj);
    }).catch(err => {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = err.message || err;
        utils.writeErrorLog('stateStore', 'getStates', 'Error while fetching state data', err, queryParam);
        cb(resObj);
    });
}

// Function to fetch Store list using state id
const getStores = (req, res, cb) => {
	utils.writeInsideFunctionLog('stateStore', 'getStores', req.query);
    const stateId = req.query.stateId;
	let resObj = Object.assign({}, utils.getErrorResObj());
    if (stateId) {
        const queryParam = dbQuery.selectStoreQuery(stateId);
        pool.query(queryParam)
        .then(([resp]) => {
            resp.push({id: 6, name: 'Any Store'});
            resObj = Object.assign({data: resp}, utils.getSuccessResObj());
            cb(resObj);
        }).catch(err => {
            resObj['message'] = constant['OOPS_ERROR'];
            resObj['data'] = err.message || err;
            utils.writeErrorLog('stateStore', 'getStores', 'Error while fetching stores', err, queryParam);
            cb(resObj);
        });
    } else {
        resObj['message'] = constant['MISSING_ID_ERROR'];
        cb(resObj);
    }
}

const _saveStateData  = async (states, storeId)=>{
    const stateArr = states.map((state)=>{
        const stateObj ={
        state_id:state,
        store_id:storeId,
        created:helper.getDateAndTime(),
        }
        return stateObj;
    })
     const { columns, valuesArr } = utils.formatRequestDataForInsert(stateArr);
     const queryParam = dbQuery.insertQuery(constant['DB_TABLE']['STATE_STORE_MAPPING'], columns);
     await pool.query(queryParam, [valuesArr]);
}

// Function to add new Store
const addStore = async (req, res, cb) => {
	utils.writeInsideFunctionLog('stateStore', 'addStore', req.body);
	let resObj = Object.assign({}, utils.getErrorResObj());
    try {
        const addData = _formateStoreData(req.body);
        const { columns, valuesArr } = utils.formatRequestDataForInsert([addData]);
        const queryParam = dbQuery.insertQuery(constant['DB_TABLE']['STORES'], columns);
        await pool.query(queryParam, [valuesArr]).then(async(resp) => {
            if(req.body.state.length){
                await _saveStateData(req.body?.state,resp[0].insertId);
            }
            const responseData = {...req.body,id:resp[0].insertId};
            resObj = Object.assign({data:responseData}, utils.getSuccessResObj());
            resObj['message'] = constant['SUCCESS_MSG'];
            cb(resObj);
        }).catch(err => {
            resObj['message'] = constant['OOPS_ERROR'];
            resObj['data'] = err.message || err;
            utils.writeErrorLog('stateStore', 'addStore', 'Error while adding new store', err, queryParam);
            cb(resObj);
        });
    } catch(error) {
        resObj['message'] = error.message || error;
        utils.writeErrorLog('stateStore', 'addStore', 'Error in adding new store function', error);
        cb(resObj);
    }
}

// Function to update Store by id
const updateStore = async (req, res, cb) => {
	utils.writeInsideFunctionLog('stateStore', 'updateStore', req.body);
	let resObj = Object.assign({}, utils.getErrorResObj());
    const storeId = req.params.id;
    try {
       const updateData = _formateStoreData(req.body, storeId);
       const queryParam = dbQuery.updateQuery(constant['DB_TABLE']['STORES'], updateData, {id: storeId});
       await pool.query(queryParam).then(async (resp) => {
        if(req.body.state.length){
            const queryParamState = dbQuery.deleteQuery(constant['DB_TABLE']['STATE_STORE_MAPPING'], {store_id:storeId});
            await pool.query(queryParamState);
            await _saveStateData(req.body?.state, storeId);
        }
        resObj = Object.assign({data: {...updateData}}, utils.getSuccessResObj());
        resObj['message'] = constant['UPDATE_SUCCESS_MSG'];
        cb(resObj);
        }).catch(err => {
            resObj['message'] = constant['OOPS_ERROR'];
            resObj['data'] = err.message || err;
            utils.writeErrorLog('stateStore', 'updateStore', 'Error while updating store', err, queryParam);
            cb(resObj);
        });
    } catch(error) {
        resObj['message'] = error.message || error;
        utils.writeErrorLog('stateStore', 'updateStore', 'Error in updating store function', error);
        cb(resObj);
    }
}

// Function to delete Store by id
const deleteStore = async (req, res, cb) => {
	utils.writeInsideFunctionLog('stateStore', 'deleteStore');
	let resObj = Object.assign({}, utils.getErrorResObj());
    const storeId = req.params.id;
    try {
        const queryParam = dbQuery.deleteMultipleQuery(constant['DB_TABLE']['STORES'], 'id', [storeId]);
        await pool.query(queryParam).then(async (resp) => {
            const queryParamState = dbQuery.deleteQuery(constant['DB_TABLE']['STATE_STORE_MAPPING'], {store_id:storeId});
            await pool.query(queryParamState).then((resp)=>{
                resObj = Object.assign({}, utils.getSuccessResObj());
                resObj['message'] = constant['DELETE_SUCCESS_MSG'];
                cb(resObj);
            }).catch((err)=>{
                resObj['message'] = constant['OOPS_ERROR'];
                resObj['data'] = err.message || err;
                utils.writeErrorLog('stateStore', 'deleteStore', 'Error while deleting state store Mapping', err, queryParamState);
                cb(resObj);
            })
        }).catch(err => {
            resObj['message'] = constant['OOPS_ERROR'];
            resObj['data'] = err.message || err;
            utils.writeErrorLog('stateStore', 'deleteStore', 'Error while deleting store', err, queryParam);
            cb(resObj);
        });
    } catch(error) {
        resObj['message'] = error.message || error;
        utils.writeErrorLog('stateStore', 'deleteStore', 'Error in deleting store function', error);
        cb(resObj);
    }
}

module.exports = {
	getStates,
    getStores,
    addStore,
    updateStore,
    deleteStore
}