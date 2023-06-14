const rfr = require('rfr');

const dietPlanModel = rfr('/models/dietPlan');
const utils = rfr('/shared/utils');

const getUserDietPlan = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  dietPlanModel.getUserDietPlan(req, res, cb);
}

const dietPlanOptions = (req, res) => {
	let cb = function(result) {
		utils.sendResponse(res, result);
	}
	dietPlanModel.dietPlanOptions(req, res, cb);
}

const updateUserDietPlan = (req, res) => {
	let cb = function(result) {
		utils.sendResponse(res, result);
	}
	dietPlanModel.updateUserDietPlan(req, res, cb);
}

module.exports = {
  getUserDietPlan,
  dietPlanOptions,
  updateUserDietPlan
}
