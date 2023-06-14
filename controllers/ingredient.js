const rfr = require('rfr');
const ingredientsModel = rfr('/models/ingredient');
const utils = rfr('/shared/utils');

const getAllIngredients = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  ingredientsModel.getAllIngredient(req, res, cb);
}

const addIngredient = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  ingredientsModel.addIngredient(req, res, cb);
}

const updateIngredient =(req,res)=>{
  let cb = function(result) {
      utils.sendResponse(res, result);
    }
    ingredientsModel.updateIngredient(req, res, cb);
}

const deleteIngredient =(req,res)=>{
  let cb = function(result) {
      utils.sendResponse(res, result);
    }
  ingredientsModel.deleteIngredient(req, res, cb);
}

const ingredientUnits =(req,res)=>{
  let cb = function(result) {
      utils.sendResponse(res, result);
    }
  ingredientsModel.ingredientUnits(req, res, cb);
}

module.exports = {
 getAllIngredients,
 addIngredient,
 updateIngredient,
 deleteIngredient,
 ingredientUnits
}
