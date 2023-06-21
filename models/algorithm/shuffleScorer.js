const rfr = require("rfr");
const utils = rfr("/shared/utils");

// Function to get recipe pool after applying shuffle scorer to each recipe
const get = (recipePoolIdArray) => {
  utils.writeInsideFunctionLog('shuffleScorer', 'get', recipePoolIdArray);
  const min = -25;
  const max = 25;

  let recipePool = [];
  recipePoolIdArray.forEach(recipeId => {
    recipePool.push({
      id: recipeId,
      'shuffleScore': Math.floor(Math.random() * (max - min + 1) + min)
    });
  });

  return recipePool;
};

module.exports = {
  get,
};
