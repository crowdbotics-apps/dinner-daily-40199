const rfr = require('rfr');
const excelJs = require('exceljs');
const { MANDATORY_FIELD_ERROR } = require('../../shared/constant');

const pool = rfr('/db/index');
const constant = rfr('/shared/constant');
const utils = rfr('/shared/utils');
const helper = rfr('/shared/helper');
const dbQuery = rfr('/shared/query');


//Common function to fetch stores tand their state and sale special data from database
const _fetchStore = async (queryParam) => {
    utils.writeInsideFunctionLog("store", "_fetchStore");
    return await pool.query(queryParam).then(async ([results]) => {
        return results;
    }).catch((error) => {
        utils.writeErrorLog('store', '_fetchStore', 'Error while fetching stores  and their state', error, queryParam);
        throw  error;
    });
}

// Function to delete store sale detail from prices table in database
const _deleteStoreSaleDetail = async (storeId) => {
    const queryParam = dbQuery.deleteQuery(constant['DB_TABLE']['PRICES'], {store_id: storeId});
    return await pool.query(queryParam).then(([resp])=>{
        return constant['DELETE_SUCCESS_MSG'];
     }).catch((error)=>{
        utils.writeErrorLog('store', '_deleteStoreSaleDetail', 'Error while deleting store sale detail in database', error, queryParam);
        return constant['OOPS_ERROR'];
     })
}


//Function to insert  store ingredient sale detail data in prices table
const _insertStoreSaleDetail = async (reqData) => {
    const { columns, valuesArr } = utils.formatRequestDataForInsert(reqData);
    const queryParam = dbQuery.insertQuery(constant['DB_TABLE']['PRICES'], columns);
    return await pool.query(queryParam, [valuesArr])
    .then(([resp]) => {
        return resp['insertId'];
    }).catch(err => {
        utils.writeErrorLog('store', '_insertStoreSaleDetail', 'Error while adding sale store detail in prices table in database', err, queryParam);
        throw err;
    });
}


// Function to fetch Store list using state id
const getStores = async (req, res, cb) => {
	utils.writeInsideFunctionLog('store', 'getStores');
	let resObj = Object.assign({}, utils.getErrorResObj());
    let isNotification = req.query.notification;
    const paginationObj = helper.getPagination(req.query?.page, req.query?.pageSize,req.query?.sortField,req.query?.sortValue);
    let queryParam = (!!isNotification && isNotification == 'true') ? dbQuery.selectQuery(constant['DB_TABLE']['STORES'], [], {}, paginationObj) : dbQuery.fetchStateStoreQuery;
    try {
        const storeData = await _fetchStore(queryParam, isNotification);
        resObj = Object.assign({data: storeData, total_items: storeData.length}, utils.getSuccessResObj());
        cb(resObj);
    } catch (err) {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = err.message || err;
        utils.writeErrorLog('store', 'getStores', 'Error while fetching stores', err, queryParam);
        cb(resObj);
    }
}

// Function to add store sale price data in database
const uploadSpecial = async (req, res, cb) => {
    utils.writeInsideFunctionLog('store', 'uploadSpecial');
    let resObj = Object.assign({}, utils.getErrorResObj());
    if (!!req.files && req.files['content'] && req.files['content'].length) {
        const workbook = new excelJs.Workbook();
        workbook.xlsx.load(req.files['content'][0].buffer).then(async () => {
          if (workbook.worksheets.length) {
            const worksheet = workbook.getWorksheet(1);
            const firstRow = worksheet.getRow(1);
            const storeName = firstRow.values[2];
            if (!!storeName) {
              const queryParam = dbQuery.selectQuery(constant['DB_TABLE']['STORES'], ['id'], {name: `'${storeName}'`});
              return await pool.query(queryParam).then(async ([resp]) => {
                if (!resp.length) {
                  resObj['message'] = constant['NO_STORE_MATCH'];
                  return cb(resObj);
                }
                const storeId = resp[0]['id'];
                const startDate = worksheet.getRow(2).values[2];
                const stopDate = worksheet.getRow(3).values[2];
                let reqObjArr = [];
                for (let i = 9; i <= worksheet.rowCount; i++) {
                  const currentRow = worksheet.getRow(i);
                  let currentRowValues = currentRow.values;
                  if (!!currentRowValues.length && !!currentRowValues[1]) {
                    let reqObj = {
                      store_id: storeId,
                      start_date: startDate,
                      stop_date: stopDate,
                      created: helper.getDateAndTime(),
                      ingredient_id: currentRowValues[1],
                      is_on_sale: Number(!!currentRowValues[3]),
                      brand1: currentRowValues[4],
                      sales_info1: currentRowValues[5],
                      brand2: currentRowValues[6],
                      sales_info2: currentRowValues[7],
                      brand3: currentRowValues[8],
                      sales_info3: currentRowValues[9]
                    }
                    reqObjArr.push(reqObj);
                  }
                }
                // await _deleteStoreSaleDetail(storeId);
                await _insertStoreSaleDetail(reqObjArr);
                resObj = Object.assign({data: reqObjArr}, utils.getSuccessResObj());
                cb(resObj);
              }).catch(err => {
                resObj['message'] = constant['OOPS_ERROR'];
                resObj['data'] = err.message || err;
                utils.writeErrorLog('store', 'uploadSpecial', 'Error while fetching store name from database', err, queryParam);
                cb(resObj);
              });
            } else {
              resObj['message'] = constant['NO_STORE_MATCH'];
              cb(resObj);
            }
          } else {
            resObj['message'] = constant['NO_SHEET_ERROR'];
            cb(resObj);
          }
        }).catch(error => {
          utils.writeErrorLog('store', 'uploadSpecial', 'Error while reading excel file', error);
          resObj['message'] = error;
          cb(resObj);
        })
    } else {
        resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
        cb(resObj);
    }
}

// Function to fetch Store ingredient list from prices table for sale details
const getStoreSpecial = async (req, res, cb) => {
    const storeId = req.params.id;
	utils.writeInsideFunctionLog('store', 'getStoreSpecial', storeId);
	let resObj = Object.assign({}, utils.getErrorResObj());
    if (!!storeId) {
        let queryParam = dbQuery.fetchStoreSpecialQuery(storeId);
        await pool.query(queryParam)
        .then(([resp]) => {
            resObj = Object.assign({data: resp}, utils.getSuccessResObj());
            cb(resObj);
        }).catch(err => {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = err.message || err;
        utils.writeErrorLog('store', 'getStoreSpecial', 'Error while fetching store sale ingredients', err, queryParam);
        cb(resObj);
       })
    } else {
        resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
        cb(resObj);
    }
}

// Function to update Store ingredient sale details in database (prices table)
const updateStoreSpecial = async (req, res, cb) => {
	utils.writeInsideFunctionLog('store', 'updateStoreSpecial', req.body);
	let resObj = Object.assign({}, utils.getErrorResObj());
    if (!!req.body.length && !!req.params.id) {
        let queryParam = dbQuery.updateStoreSpecialQuery(req.body, req.params.id)
        await pool.query(queryParam)
        .then(([resp]) => {
            resObj = Object.assign({}, utils.getSuccessResObj());
            resObj['message'] = constant['UPDATE_SUCCESS_MSG'];
            cb(resObj);
        }).catch(err => {
            resObj['message'] = constant['OOPS_ERROR'];
            resObj['data'] = err.message || err;
            utils.writeErrorLog('store', 'updateStoreSpecial', 'Error while updating is_on_sale detail', err, queryParam);
            cb(resObj);
       })
    } else {
        resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
        cb(resObj);
    }
}


module.exports = {
    getStores,
    uploadSpecial,
    getStoreSpecial,
    updateStoreSpecial
}