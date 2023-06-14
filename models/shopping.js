const rfr = require('rfr');

const pool = rfr('/db/index');

const constant = rfr('/shared/constant');
const utils = rfr('/shared/utils');
const dbQuery = rfr('/shared/query');
const helper = rfr('/shared/helper');

// Function to give weekly content on home page
const shoppingSaleDetail = (req, res, cb) => {
	utils.writeInsideFunctionLog('shopping', 'shoppingSaleDetail');
    const userId = req.userData.id;
	let resObj = Object.assign({}, utils.getErrorResObj());
    const queryParam = dbQuery.fetchUserQuery(userId);
	pool.query(queryParam)
    .then(resp => {
        const userData = resp[0][0] || {};
        const saleStartDay = userData['sale_period_start'];
        const saleEndDay = userData['sale_period_end'];
        const {saleStartDate, saleEndDate} = utils.getSaleDates(saleStartDay, saleEndDay);
        const respObj = {
            'sale': {
                'startDate': `${saleStartDate.getUTCDate()} ${helper.monthMapping[saleStartDate.getUTCMonth() + 1]}`,
                'startDay': helper.weekDayMapping[saleStartDay],
                'endDate': `${saleEndDate.getUTCDate()} ${helper.monthMapping[saleEndDate.getUTCMonth() + 1]}`,
                'endDay': helper.weekDayMapping[saleEndDay],
            },
            'storeName': userData['storeName'],
            'familySize': userData['family_size']
        }
        resObj = Object.assign({data: respObj}, utils.getSuccessResObj());
        cb(resObj);
    }).catch(err => {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['date'] = err.message || err;
        utils.writeErrorLog('shopping', 'shoppingSaleDetail', 'Error while fetching user shopping list data', err, queryParam);
        cb(resObj);
    });
}

// Function to fetch shopping categories
const shoppingCategories = (req, res, cb) => {
	utils.writeInsideFunctionLog('shopping', 'shoppingCategories');
    let resObj = Object.assign({}, utils.getErrorResObj());
    const paginationObj = helper.getPagination(req.query?.page, req.query?.pageSize, req.query?.sortField, 'desc');
    const queryParam = dbQuery.selectQuery(constant['DB_TABLE']['SHOPPING_CATEGORIES'], ['id', 'name'], {}, paginationObj);
	pool.query(queryParam)
    .then(resp => {
        resObj = Object.assign({data: resp[0]}, utils.getSuccessResObj());
        cb(resObj);
    }).catch(err => {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['date'] = err.message || err;
        utils.writeErrorLog('shopping', 'shoppingCategories', 'Error while fetching shopping categories data', err, queryParam);
        cb(resObj);
    });
}

// Function to get shopping list ingredients
const getIngredients = (req, res, cb) => {
	utils.writeInsideFunctionLog('shopping', 'getIngredients');
    let resObj = Object.assign({}, utils.getErrorResObj());
    const queryParam = dbQuery.selectQuery(constant['DB_VIEW']['SHOPPING_LIST_ITEMS_VIEW'], [], {user_id: req.userData.id});
	pool.query(queryParam)
    .then(resp => {
        const resultArray = resp[0].reduce((outKey, inputKey) => {
            let key = inputKey.name
            outKey[key] = outKey[key] || [];
            outKey[key].push(inputKey);
            return outKey;
        }, Object.create(null));
        resObj = Object.assign({data: resultArray}, utils.getSuccessResObj());
        cb(resObj);
    }).catch(err => {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['date'] = err.message || err;
        utils.writeErrorLog('shopping', 'getIngredients', 'Error while fetching ingredient for shopping list', err, queryParam);
        cb(resObj);
    });
}

// Function to add user ingredients in shopping list item
const addIngredient = (req, res, cb) => {
	utils.writeInsideFunctionLog('shopping', 'addIngredient', req.body);
    let resObj = Object.assign({}, utils.getErrorResObj());
    let shoppingListObj = {
        ...req.body,
        ...helper.defaultShoppingListItemsObj,
        created: helper.getDateAndTime()
    }
    const { columns, valuesArr } = utils.formatRequestDataForInsert([shoppingListObj]);
    const queryParam = dbQuery.insertQuery(constant['DB_TABLE']['SHOPPING_LIST_ITEMS'], columns);
	pool.query(queryParam, [valuesArr])
    .then(resp => {
        resObj = Object.assign({data: {id: resp[0]['insertId']}}, utils.getSuccessResObj());
        resObj['message'] = constant['SUCCESS_MSG'];
        cb(resObj);
    }).catch(err => {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['date'] = err.message || err;
        utils.writeErrorLog('shopping', 'addIngredient', 'Error while add user ingredient in shopping list items', err, queryParam);
        cb(resObj);
    });
}

// Function to update shopping ingredient in shopping list item
const updateIngredient = (req, res, cb) => {
	utils.writeInsideFunctionLog('shopping', 'updateIngredient', req.body);
    let resObj = Object.assign({}, utils.getErrorResObj());
    let itemId = req.params.id;
    if (!!itemId) {
        let reqBody = {
            ...req.body,
            updated: helper.getDateAndTime()
        };
        const queryParam = dbQuery.updateQuery(constant['DB_TABLE']['SHOPPING_LIST_ITEMS'], reqBody, {id: itemId});
        pool.query(queryParam)
        .then(resp => {
            resObj = Object.assign({data: {...reqBody, id: itemId}}, utils.getSuccessResObj());
            resObj['message'] = constant['UPDATE_SUCCESS_MSG'];
            cb(resObj);
        }).catch(err => {
            resObj['message'] = constant['OOPS_ERROR'];
            resObj['date'] = err.message || err;
            utils.writeErrorLog('shopping', 'updateIngredient', 'Error while add user ingredient in shopping list items', err, queryParam);
            cb(resObj);
        });
    } else {
        resObj['message'] = constant['MISSING_ID_ERROR'];
        utils.writeErrorLog('shopping', 'updateIngredient', 'Ingredient id is missing in request parameter');
        cb(resObj);
    }
}

// Function to delete ingredients from shopping list item
const deleteIngredient = (req, res, cb) => {
	utils.writeInsideFunctionLog('shopping', 'deleteIngredient', req.params);
    let resObj = Object.assign({}, utils.getErrorResObj());
    let itemId = req.params.id;
    const queryParam = dbQuery.deleteQuery(constant['DB_TABLE']['SHOPPING_LIST_ITEMS'], {id: itemId});
	if (!!itemId) {
        pool.query(queryParam)
        .then(resp => {
            resObj = Object.assign({}, utils.getSuccessResObj());
            resObj['message'] = constant['DELETE_SUCCESS_MSG'];
            cb(resObj);
        }).catch(err => {
            resObj['message'] = constant['OOPS_ERROR'];
            resObj['date'] = err.message || err;
            utils.writeErrorLog('shopping', 'deleteIngredient', 'Error while deleting ingredient in shopping list items', err, queryParam);
            cb(resObj);
        });
    } else {
        resObj['message'] = constant['MISSING_ID_ERROR'];
        utils.writeErrorLog('shopping', 'deleteIngredient', 'Ingredient id is missing in request parameter');
        cb(resObj);
    }
}

module.exports = {
	shoppingSaleDetail,
    shoppingCategories,
    getIngredients,
    addIngredient,
    updateIngredient,
    deleteIngredient
}