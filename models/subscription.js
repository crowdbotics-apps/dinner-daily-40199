const rfr = require('rfr');

const constant = rfr('/shared/constant');
const utils = rfr('/shared/utils');
const config = rfr('/shared/config');
const helper = rfr('/shared/helper');
const dbQuery = rfr('/shared/query');

const pool = rfr('/db/index');

const stripe = require('stripe')(config['stripe']['secretKey']);

const _updateUserSubscriptionPlanStatus = (reqBody) => {
    try {
        utils.writeInsideFunctionLog('subscription', '_updateUserSubscriptionPlanStatus', reqBody);
        const reqObj = reqBody.data.object;
        const queryParam = dbQuery.updateQuery(constant['DB_TABLE']['USERS'], {'subscription_plan': reqObj.subscription}, {email: `'${reqObj.customer_email}'`});
        pool.query(queryParam);
    } catch (err) {
        utils.writeErrorLog('subscription', '_updateUserSubscriptionPlanStatus', 'Error while updating user subscription plan id in user table', err);
    }
}

const _paymentFailed = (reqBody) => {
    utils.writeErrorLog('subscription', '_paymentFailed', 'Error occurred during payment', reqBody);
}

// Function to get user Subscription Status
const getUserSubscriptionStatus = async (req, res, cb) => {
	utils.writeInsideFunctionLog('subscription', 'getUserSubscriptionStatus');
    let resObj = Object.assign({}, utils.getErrorResObj());
    try {
        const userData = req.userData;
        const userEmail = userData.email;
        const emailDomain = userEmail.split('@')[1];
        const queryParam = dbQuery.selectQuery(constant['DB_TABLE']['SUBSCRIPTION_PLAN_AND_DOMAINS'], [], {'domain': `'${emailDomain}'`});
        await pool.query(queryParam)
        .then(async resp => {
            let obj = {
                'isCorporateUser': constant['FALSE']
            };
            if (resp[0].length) {
                obj['isCorporateUser'] = constant['TRUE'];
                resObj = Object.assign({data: obj}, utils.getSuccessResObj());
                return cb(resObj);
            }
            const subscriptionId = userData.subscription_plan;

            let planDaysLeft = utils.dateDiffInDays(userData['created'], utils.getCurrentDate());
            if (!userData['subscription_plan']) {
                obj['status'] = planDaysLeft < 14 ? constant['SUBSCRIPTION_STATUS']['FREE'] : constant['SUBSCRIPTION_STATUS']['EXPIRED'];
                obj['daysLeft'] = (constant['FREE_TRIAL_DAYS'] - planDaysLeft);
                obj['existingPlan'] = constant['FALSE'];
            } else {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId,  {expand: ['plan.product']});
                // subscription time is in unix timestam so multiplied by 1000
                planDaysLeft = utils.dateDiffInDays(utils.getCurrentDate(), subscription['current_period_end'] * 1000);
                obj['status'] = subscription['status'];
                obj['planName'] = subscription['plan']['product']['name'];
                obj['daysLeft'] = planDaysLeft;
                obj['existingPlan'] = constant['TRUE'];
            }
            obj['trial_days'] = obj['daysLeft'];
            resObj = Object.assign({data: obj}, utils.getSuccessResObj());
            cb(resObj);
        }).catch(err => {
            resObj['message'] = err.message || err;
            utils.writeErrorLog('subscription', 'getUserSubscriptionStatus', 'Error while fetching corporation domain data', err);
            cb(resObj);
        });
    } catch(err) {
        resObj['message'] = err.message || err;
        utils.writeErrorLog('subscription', 'getUserSubscriptionStatus', 'Error while fetching user subscription data', err);
        cb(resObj);
    };
}

// Function to fetch product(Subscription) list from Stripe and their prices details
const getSubscriptionPlanList = async (req, res, cb) => {
	utils.writeInsideFunctionLog('subscription', 'getSubscriptionPlanList');
    let resObj = Object.assign({}, utils.getErrorResObj());
    try {
        const productPriceData = await stripe.prices.list({
            expand: ['data.product'],
            limit: 5,
          });
          let respObj = [];
          productPriceData['data'].forEach(productPrice => {
              if (productPrice.product.active) {
                respObj.push({
                    "id": productPrice.id,
                    "name": productPrice.product.name,
                    "currency": productPrice.currency,
                    "type": productPrice.type,
                    "amount": productPrice.unit_amount,
                    "recurring_count": productPrice.recurring.interval_count,
                    "recurring_interval": productPrice.recurring.interval
                })
            }
        });

        resObj = Object.assign({data: respObj}, utils.getSuccessResObj());
        cb(resObj);
    } catch(err) {
        resObj['message'] = err.message || err;
        utils.writeErrorLog('subscription', 'getSubscriptionPlanList', 'Error while fetching subscription plan list from stripe', err);
        cb(resObj);
    };
}

// Function to create a subscription for payment in user
// const createPaymentIntent = async (req, res, cb) => {
//     const reqBody = req['body'];
// 	utils.writeInsideFunctionLog('subscription', 'createPaymentIntent', reqBody);
//     let resObj = Object.assign({}, utils.getErrorResObj());
//     try {
//         const customer = await stripe.customers.create({
//             email: req.userData.email,
//             name: req.userData.name,
//         });
//         const ephemeralKey = await stripe.ephemeralKeys.create(
//             {customer: customer.id},
//             {apiVersion: '2020-08-27'}
//         );
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: reqBody.amount,
//             currency: reqBody.currency,
//             customer: customer.id,
//             payment_method_types: ['card'],
//         });

//         let respObj = {
//             paymentIntent: paymentIntent.client_secret,
//             ephemeralKey: ephemeralKey.secret,
//             customerId: customer.id,
//             publishableKey: config['stripe']['publishableKey']
//         };
//         resObj = Object.assign({data: respObj}, utils.getSuccessResObj());
//         cb(resObj);
//     } catch(err) {
//         resObj['message'] = err.message || err;
//         utils.writeErrorLog('subscription', 'createPaymentIntent', 'Error while creating payment intent for payment', err);
//         cb(resObj);
//     };
// }

// Function to create a user subscription for payment in user
const createUserSubscription = async (req, res, cb) => {
    const reqBody = req['body'];
	utils.writeInsideFunctionLog('subscription', 'createUserSubscription', reqBody);
    let resObj = Object.assign({}, utils.getErrorResObj());
    try {
        let userData = req.userData;
        let customerId = userData.stripe_customer_id;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: userData.email,
                name: userData.name,
            });
            customerId = customer.id;
            const queryParam = dbQuery.updateQuery(constant['DB_TABLE']['USERS'], {'stripe_customer_id': customerId}, {id: userData.id});
            await pool.query(queryParam);
        }

        const ephemeralKey = await stripe.ephemeralKeys.create(
            {customer: customerId},
            {apiVersion: '2020-08-27'}
        );
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
              price: reqBody.priceId,
            }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
          });

        let respObj = {
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customerId: customerId,
            publishableKey: config['stripe']['publishableKey']
        };
        resObj = Object.assign({data: respObj}, utils.getSuccessResObj());
        cb(resObj);
    } catch(err) {
        resObj['message'] = err.message || err;
        utils.writeErrorLog('subscription', 'createUserSubscription', 'Error while creating user subscriptionon stripe for payment', err);
        cb(resObj);
    };
}

// Function to deactivate user account and cancel his subscription
const deleteUserAccountAndSubscription = async (req, res, cb) => {
    const reqBody = req['body'];
	utils.writeInsideFunctionLog('subscription', 'deleteUserAccountAndSubscription', reqBody);
    let resObj = Object.assign({}, utils.getErrorResObj());
    try {
        let userData = req.userData;
        const subscriptionId = userData.subscription_plan;
        const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['USERS'], {enabled: constant['DISABLED'], updated: helper.getDateAndTime()}, {id: userData.id});
		await pool.query(updateQueryParam).then(async (resp) => {
            if (!!subscriptionId) {
                await stripe.subscriptions.update(subscriptionId, {cancel_at_period_end: true});
            }
			resObj = Object.assign({ }, utils.getSuccessResObj());
            resObj['message'] = constant['PLAN_CANCELLED_MSG'];
			cb(resObj);
		}).catch((error) => {
			resObj['message'] = constant['OOPS_ERROR'];
			resObj['data'] = error.message || error;
			utils.writeErrorLog('subscription', 'deleteUserAccountAndSubscription', 'Error while disabling user account in database', error);
			cb(resObj);
		});
    } catch(err) {
        resObj['message'] = err.message || err;
        utils.writeErrorLog('subscription', 'deleteUserAccountAndSubscription', 'Error while cancelling user subscriptionon on stripe', err);
        cb(resObj);
    };
}

// Function to update (upgrade/degrade) user subscription plan
const updateSubscription = async (req, res, cb) => {
    const reqBody = req['body'];
	utils.writeInsideFunctionLog('subscription', 'updateSubscription', reqBody);
    let resObj = Object.assign({}, utils.getErrorResObj());
    try {
        if (reqBody['newPriceId']) {
            let userData = req.userData;
            const subscriptionId = userData.subscription_plan;
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const updatedSubscription = await stripe.subscriptions.update(subscriptionId,
            {
                cancel_at_period_end: false,
                items: [{
                    id: subscription.items.data[0].id,
                    price: reqBody['newPriceId'],
                }],
            })
            resObj = Object.assign({ }, utils.getSuccessResObj());
            resObj['message'] = constant['PLAN_UPDATE_MSG'];
			cb(resObj);
        } else {
            resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
            utils.writeErrorLog('subscription', 'updateSubscription', 'New price id is missing in request body');
            cb(resObj);
        }
    } catch(err) {
        resObj['message'] = err.message || err;
        utils.writeErrorLog('subscription', 'updateSubscription', 'Error while cancelling user subscriptionon on stripe', err);
        cb(resObj);
    };
}

// Function to recieve webhook from stripe
const webhook = async (req, res, cb) => {
    let reqBody = req['body'];
    utils.writeInsideFunctionLog('stripeAccounts', 'webhook', reqBody);

    switch(reqBody['type']) {
    case constant['STRIPE_EVENT_TYPE']['PAYMENT_INTENT_SUCCEEDED']:
    case constant['STRIPE_EVENT_TYPE']['INVOICE_PAYMENT_SUCCEEDED']: _updateUserSubscriptionPlanStatus(reqBody);
      break;
    case constant['STRIPE_EVENT_TYPE']['PAYMENT_INTENT_FAILED']: _paymentFailed(reqBody);
    case constant['STRIPE_EVENT_TYPE']['INVOICE_PAYMENT_FAILED']: _paymentFailed(reqBody);
      break;
    }
    res.sendStatus(constant['RES_OBJ']['CODE']['SUCCESS']);
}

module.exports = {
	getUserSubscriptionStatus,
    getSubscriptionPlanList,
    createUserSubscription,
    deleteUserAccountAndSubscription,
    updateSubscription,
    webhook
}