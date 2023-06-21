const rfr = require('rfr');
const recipesModel = rfr('/models/recipe');
const utils = rfr('/shared/utils');

const getAllRecipes = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  recipesModel.getAllRecipe(req, res, cb);
}

const addRecipe = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  recipesModel.addRecipe(req, res, cb);
}

const updateRecipe =(req,res)=>{
  let cb = function(result) {
      utils.sendResponse(res, result);
    }
  recipesModel.updateRecipe(req, res, cb);
}

const deleteRecipe =(req,res)=>{
  let cb = function(result) {
      utils.sendResponse(res, result);
    }
  recipesModel.deleteRecipe(req, res, cb);
}

const weekMenu = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  recipesModel.weekMenu(req, res, cb);
}

const addFavorite = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  recipesModel.addFavorite(req, res, cb);
}

const removeFavorite = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  recipesModel.removeFavorite(req, res, cb);
}

const updateUserWeekRecipe = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  recipesModel.updateUserWeekRecipe(req, res, cb);
}

const userRecipes = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  recipesModel.userRecipes(req, res, cb);
}

const searchRecipe = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  recipesModel.searchRecipe(req, res, cb);
}

const recipeImage = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  recipesModel.recipeImage(req, res, cb);
}

const updateRecipeNotes =(req,res)=>{
  let cb = function(result) {
      utils.sendResponse(res, result);
    }
  recipesModel.updateRecipeNotes(req, res, cb);
}

module.exports = {
  getAllRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  weekMenu,
  addFavorite,
  removeFavorite,
  updateUserWeekRecipe,
  userRecipes,
  searchRecipe,
  recipeImage,
  updateRecipeNotes
}
