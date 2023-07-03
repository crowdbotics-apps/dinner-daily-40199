const rfr = require("rfr");
const pool = rfr("/db/index");

const dbQuery = rfr("/shared/query");
const utils = rfr("/shared/utils");
const constant = rfr("/shared/constant");

// Function to get recipe pool after assiging favorite scorer to all recipe
const get = async (recipePool, userData) => {
  utils.writeInsideFunctionLog('favoriteScorer', 'get', recipePool);
  const noScore = 0;
  const maxScore = 400;
  const favoritePriod = 18;
  const userAge = utils.dateDiffInDays(userData['created'], utils.getCurrentDate());
  // Apply favorite scorer only when user age is less than 18 days in the system
  if (userAge < favoritePriod) {
    let queryParam = dbQuery.favoriteRecipeCountQuery(constant['DISH_TYPE']);
    return await pool.query(queryParam)
    .then(([resp]) => {
      const favoriteRecipes = resp.map(recipe => recipe.id);
      recipePool.forEach(recipe => {
        if (favoriteRecipes.indexOf(recipe.id) > -1) {
          recipe['favoriteScore'] = maxScore;
        } else {
          recipe['favoriteScore'] = noScore;
        }
      });
      return recipePool;
    }).catch(err => {
      utils.writeErrorLog('favoriteScorer', 'get', 'Error while assigning favorite scorer to recipes', err, queryParam);
      recipePool.forEach(recipe => recipe['favoriteScore'] = noScore);
      return recipePool;
    })
  } else {
    recipePool.forEach(recipe => recipe['favoriteScore'] = noScore);
  }

  return recipePool;
};

module.exports = {
  get,
};
