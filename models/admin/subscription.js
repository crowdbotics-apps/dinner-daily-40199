const rfr = require('rfr');

const constant = rfr('/shared/constant');
const utils = rfr('/shared/utils');
const config = rfr('/shared/config');
const helper = rfr('/shared/helper');
const dbQuery = rfr('/shared/query');

const pool = rfr('/db/index');

const stripe = require('stripe')(config['stripe']['secretKey']);

const _formatResponse = (resp,name) => {
    let responeObj = {
        id: resp?.id,
        currency: resp?.currency,
        name: name,
        amount: resp?.unit_amount,
        recurring_count: resp?.recurring?.interval_count,
        recurring_interval: resp?.recurring?.interval,
        type: resp?.type
    }
    return responeObj;
}

// Function to create a user subscription for payment in user
const createSubscription = async (req, res, cb) => {
    utils.writeInsideFunctionLog('subscription', 'createSubscription', req.body);
    let resObj = Object.assign({}, utils.getErrorResObj());
    const data = req.body;
    if (helper.notEmpty(data.name) && helper.notEmpty(data.amount) && helper.notEmpty(data.recurringObj)) {
        try {
            const product = await stripe.products.create({
                name: data.name,
            });
            if (product) {
                const subscription = await stripe.prices.create({
                    unit_amount: data.amount * 100,
                    currency: 'usd',
                    recurring: data.recurringObj,
                    product: product?.id,
                });
                if (subscription) {
                    const response = _formatResponse(subscription,product?.name);
                    resObj = Object.assign({ data: response }, utils.getSuccessResObj());
                    cb(resObj);
                } else {
                    resObj['message'] = constant['OOPS_ERROR'];
                    cb(resObj);
                }
            } else {
                resObj['message'] = constant['OOPS_ERROR'];
                cb(resObj);
            }
        } catch (err) {
            resObj['message'] = err.message || err;
            utils.writeErrorLog('subscription', 'createSubscription', 'Error while creating Subscription stripe', err);
            cb(resObj);
        };
    } else {
        resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
        cb(resObj);
    }
}

// Function to deactivate user account and cancel his subscription
const deleteSubscription = async (req, res, cb) => {
    utils.writeInsideFunctionLog('subscription', 'deleteSubscription', req.params);
    let resObj = Object.assign({}, utils.getErrorResObj());
    try {
        let userData = req.userData;
        const subscriptionId = userData.subscription_plan;
        if (!!subscriptionId) {
            const deleted = await stripe.products.del(
                req.params.id
              );
        }
        resObj = Object.assign({}, utils.getSuccessResObj());
        cb(resObj);
    } catch (err) {
        resObj['message'] = err.message || err;
        utils.writeErrorLog('subscription', 'deleteSubscription', 'Error while delete Product from stripe', err);
        cb(resObj);
    };
}

// Function to deactivate user account and cancel his subscription
const updateSubscription = async (req, res, cb) => {
    utils.writeInsideFunctionLog('subscription', 'updateSubscription', req.body);
    const data = req.body;
    let resObj = Object.assign({}, utils.getErrorResObj());
    if (helper.notEmpty(data.name) && helper.notEmpty(data.amount) && helper.notEmpty(data.recurringObj) && helper.notEmpty(req.params.id)) {
        try {
            const subscription = await stripe.prices.update(
                req.params.id,
                {
                    unit_amount: data.amount,
                    recurring: data.recurringObj,
                    product: data.name,
                }
            );
            if (subscription) {
                const response = _formatResponse(subscription);
                resObj = Object.assign({ data: response }, utils.getSuccessResObj());
                resObj['message'] = constant['PLAN_UPDATE_MSG'];
                cb(resObj);
            } else {
                resObj['message'] = constant['OOPS_ERROR'];
                utils.writeErrorLog('subscription', 'updateSubscription', 'Error while updating subscriptionon on stripe');
                cb(resObj);
            }
        } catch (err) {
            resObj['message'] = err.message || err;
            utils.writeErrorLog('subscription', 'updateSubscription', 'Error while updating subscriptionon on stripe', err);
            cb(resObj);
        }
    } else {
        resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
        cb(resObj);
    }

}

module.exports = {
    createSubscription,
    deleteSubscription,
    updateSubscription
}