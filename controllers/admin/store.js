const rfr = require('rfr');
const stateStoreModel = rfr('/models/admin/store');
const utils = rfr('/shared/utils');

const getStores = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  stateStoreModel.getStores(req, res, cb);
}

const uploadSpecial = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  stateStoreModel.uploadSpecial(req, res, cb);
}

const storeSpecial = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  stateStoreModel.getStoreSpecial(req, res, cb);
}

const updateStoreSpecial = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  stateStoreModel.updateStoreSpecial(req, res, cb);
}

module.exports =  {
    getStores,
    uploadSpecial,
    storeSpecial,
    updateStoreSpecial
  }