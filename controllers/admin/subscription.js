const rfr = require('rfr');

const subscriptionModel = rfr('/models//admin/subscription');
const utils = rfr('/shared/utils');


const createSubscription = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  subscriptionModel.createSubscription(req, res, cb);
}

const deleteSubscription = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  subscriptionModel.deleteSubscription(req, res, cb);
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
  createSubscription,
  deleteSubscription,
  updateSubscription,
  webhook
}
