const rfr = require('rfr');

const stateStoreModel = rfr('/models/stateStore');
const utils = rfr('/shared/utils');

const getStates = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  stateStoreModel.getStates(req, res, cb);
}

const getStores = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  stateStoreModel.getStores(req, res, cb);
}

const addStore = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  stateStoreModel.addStore(req, res, cb);
}

const deleteStore = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  stateStoreModel.deleteStore(req, res, cb);
}

const updateStore = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  stateStoreModel.updateStore(req, res, cb);
}

module.exports =  {
  getStates,
  getStores,
  addStore,
  updateStore,
  deleteStore
}
