const rfr = require('rfr');
const adminIngredientsModel = rfr('/models/admin/ingredient');
const utils = rfr('/shared/utils')

const getAllIngredients = (req, res) => {
    let cb = function(result) {
      utils.sendResponse(res, result);
    }
    adminIngredientsModel.getAllIngredient(req, res, cb);
  }

const ingredientCategory = (req, res) => {
    let cb = function(result) {
      utils.sendResponse(res, result);
    }
    adminIngredientsModel.ingredientCategory(req, res, cb);
  }
 

const addIngredientCategory = (req, res)=>{
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminIngredientsModel.addIngredientCategory(req, res, cb);
}

const updateIngredientCategory = (req, res)=>{
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminIngredientsModel.updateIngredientCategory(req, res, cb);
}
const deleteIngredientCategory = (req, res)=>{
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminIngredientsModel.deleteIngredientCategory(req, res, cb);
}

const getAllTags = (req, res)=>{
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminIngredientsModel.getAllTags(req, res, cb);
}

module.exports = {
    getAllIngredients,
    ingredientCategory,
    updateIngredientCategory,
    addIngredientCategory,
    deleteIngredientCategory,
    getAllTags
   }
   