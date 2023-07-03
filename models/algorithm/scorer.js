const rfr = require("rfr");

const utils = rfr("/shared/utils");
const shuffleScorer = rfr('/models/algorithm/shuffleScorer');
const favoriteScorer = rfr('/models/algorithm/favoriteScorer');
const tieredIngredientSaleScorer = rfr('/models/algorithm/tieredIngredientSaleScorer');
const ingredientBalanceScorer = rfr('/models/algorithm/ingredientBalanceScorer');
const recipeNotUsedScorer = rfr('/models/algorithm/recipeNotUsedScorer');

// Function to assign scorer to recipe and sum up of all scorer and then finally assign to each recipe in recipe pool
const get = async (recipePool, userData, selectedRecipeArr) => {
  utils.writeInsideFunctionLog('scorer', 'get', recipePool);
  const recipePoolAfterShuffleScorer = shuffleScorer.get(recipePool);
  const recipePoolAfterFavoriteScorer = await favoriteScorer.get(recipePoolAfterShuffleScorer, userData);
  const recipePoolAfterTieredIngredientSaleScorer = await tieredIngredientSaleScorer.get(userData, recipePoolAfterFavoriteScorer, recipePool);
  const recipePoolAfterIngredientBalanceScorer = await ingredientBalanceScorer.get(recipePoolAfterTieredIngredientSaleScorer, selectedRecipeArr);
  const recipePoolAfterRecipeNotUsedScorer = await recipeNotUsedScorer.get(recipePoolAfterIngredientBalanceScorer, userData);
  const recipeWithFinalScore = recipePoolAfterRecipeNotUsedScorer.map(recipe => {
    return {id: recipe.id, finalScore: recipe.shuffleScore + recipe.favoriteScore + recipe.tieredIngredientSaleScore + recipe.ingredientBalanceScore + recipe.recipeNotUsedScore};
  })
  recipeWithFinalScore.sort((a, b) => b.finalScore - a.finalScore);
  return recipeWithFinalScore;
};

module.exports = {
  get,
};
