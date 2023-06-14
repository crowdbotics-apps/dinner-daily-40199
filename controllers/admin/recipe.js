const rfr = require('rfr');
const recipesModel = rfr('/models/admin/recipe');
const utils = rfr('/shared/utils');

const getAllRecipes = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  recipesModel.getAllRecipe(req, res, cb);
}

const deleteRecipeIngredient = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  recipesModel.deleteRecipeIngredient(req, res, cb);
}

module.exports = {
    getAllRecipes,
    deleteRecipeIngredient
  }