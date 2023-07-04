const rfr = require('rfr');
const pool = rfr('/db/index');

const dbQuery = rfr('/shared/query');
const constant = rfr('/shared/constant');
const utils = rfr('/shared/utils');
const staticContent = rfr('/shared/staticContent');

// Function to give weekly content on home page
const homeContent = async (req, res, cb) => {
	utils.writeInsideFunctionLog('home', 'homeContent', req.query);
    let resObj = Object.assign({}, utils.getErrorResObj());
    let promiseArr = [];
    let queryParam = '';
    if (req.query.week === 'previous') {
        queryParam = dbQuery.selectQuery(constant['DB_VIEW']['SHOPPING_LIST_ITEMS_VIEW'], ['count(*) as count'], {user_id: req.userData.id, is_on_sale: 1, 'DATE(start_date)>=': `DATE_SUB(CURDATE(), INTERVAL 13 DAY)`, 'DATE(start_date)<': `DATE_SUB(CURDATE(), INTERVAL 6 DAY)`});
        promiseArr.push(pool.query(queryParam));
        // shopping category - 5 for Produce (fruits and vegetables)
        queryParam = dbQuery.selectQuery(constant['DB_VIEW']['SHOPPING_LIST_ITEMS_VIEW'], ['count(*) as count'], {user_id: req.userData.id, shopping_category: 5, 'DATE(start_date)>=': `DATE_SUB(CURDATE(), INTERVAL 13 DAY)`, 'DATE(start_date)<': `DATE_SUB(CURDATE(), INTERVAL 6 DAY)`});
        promiseArr.push(pool.query(queryParam));
    } else {
        queryParam = dbQuery.selectQuery(constant['DB_VIEW']['SHOPPING_LIST_ITEMS_VIEW'], ['count(*) as count'], {user_id: req.userData.id, is_on_sale: 1, 'DATE(start_date)>': `DATE_SUB(CURDATE(), INTERVAL 6 DAY)`});
        promiseArr.push(pool.query(queryParam));
        // shopping category - 5 for Produce (fruits and vegetables)
        queryParam = dbQuery.selectQuery(constant['DB_VIEW']['SHOPPING_LIST_ITEMS_VIEW'], ['count(*) as count'], {user_id: req.userData.id, shopping_category: 5, 'DATE(start_date)>': `DATE_SUB(CURDATE(), INTERVAL 6 DAY)`});
        promiseArr.push(pool.query(queryParam));
    }

    return await Promise.all(promiseArr).then((res) => {
        const respObj = {
            'saleCount': res[0][0][0]['count'],
            'veggieCount': res[1][0][0]['count']
        }
         resObj = Object.assign({data: respObj}, utils.getSuccessResObj());
        cb(resObj)
    }).catch(err => {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = err.message || err;
        utils.writeErrorLog('home', 'homeContent', 'Error while fetching weekly wins data', err, queryParam);
        cb(resObj);
    });
}


const static = (req, res, cb) => {
    utils.writeInsideFunctionLog('home', 'static');
    let respObj;
    if(req.params.name === 'privacyPolicy'){
        respObj = {
            'title': 'Privacy Policy',
            'content': staticContent.privacy_policy
        }
    }else if(req.params.name === 'termCondition') {
        respObj = {
            'title': 'Terms and Conditions',
            'content': staticContent.term_condition
        }
    }
    let resObj = Object.assign({data: respObj}, utils.getSuccessResObj());
    cb(resObj)
}

module.exports = {
	homeContent,
    static
}