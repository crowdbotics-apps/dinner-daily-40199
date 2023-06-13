const rfr = require('rfr');

const shoppingModel = rfr('/models/shopping');
const utils = rfr('/shared/utils');

const shoppingSaleDetail = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  shoppingModel.shoppingSaleDetail(req, res, cb);
}

const categories = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  shoppingModel.shoppingCategories(req, res, cb);
}

const getIngredients = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  shoppingModel.getIngredients(req, res, cb);
}

const addIngredient = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  shoppingModel.addIngredient(req, res, cb);
}

const updateIngredient = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  shoppingModel.updateIngredient(req, res, cb);
}

const deleteIngredient = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  shoppingModel.deleteIngredient(req, res, cb);
}

module.exports = {
    shoppingSaleDetail,
    categories,
    getIngredients,
    addIngredient,
    updateIngredient,
    deleteIngredient
}
