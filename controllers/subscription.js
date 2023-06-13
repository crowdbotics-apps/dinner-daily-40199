const rfr = require('rfr');

const subscriptionModel = rfr('/models/subscription');
const utils = rfr('/shared/utils');

const userSubscriptionPlanStatus = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  subscriptionModel.getUserSubscriptionStatus(req, res, cb);
}

const getSubscriptionPlanList = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  subscriptionModel.getSubscriptionPlanList(req, res, cb);
}

const createUserSubscription = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  subscriptionModel.createUserSubscription(req, res, cb);
}

const deactivateUser = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  subscriptionModel.deleteUserAccountAndSubscription(req, res, cb);
}

const updateSubscription = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  subscriptionModel.updateSubscription(req, res, cb);
}

const webhook = (req, res) => {
  subscriptionModel.webhook(req, res);
}

module.exports = {
  userSubscriptionPlanStatus,
  getSubscriptionPlanList,
  createUserSubscription,
  deactivateUser,
  updateSubscription,
  webhook
}
