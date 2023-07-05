const rfr = require("rfr");
const pool = rfr("/db/index");

const dbQuery = rfr("/shared/query");
const utils = rfr("/shared/utils");
const constant = rfr("/shared/constant");


const _formatRecipeScoreData = (recipePoolArray, userId) => {
  let recipeScoreArray = [];
  recipePoolArray.forEach(recipe => {
    recipeScoreArray.push({
      recipe_id: recipe,
      user_id: userId,
      created: 'now()'
    });
  })
  return recipeScoreArray;

}


// Function to insert / update recipe score in recipe not used scorer table.
const insertInRecipeNotUsedScore = async (requestFor, recipePoolArray, userId) => {
  try {
    utils.writeInsideFunctionLog('recipeNotUsedScorer', 'insertInRecipeNotUsedScore', recipePoolArray);
    if (requestFor === 'create' || requestFor === 'updated') {
      let promiseArray = [];
      const updateRecipeScoreObj = _formatRecipeScoreData(recipePoolArray, userId);
      let updateQueryParam = dbQuery.updateWithDuplicateKeyQuery(constant['DB_TABLE']['RECIPE_NOT_USED_SCORE'], updateRecipeScoreObj, ['score'], 'menu');
      promiseArray.push(pool.query(updateQueryParam));

      let updateUsedRecipeQueryParam = dbQuery.updateUserUsedRecipeScoreQuery(userId);
      promiseArray.push(pool.query(updateUsedRecipeQueryParam));
      return await Promise.all(promiseArray)
      .then(([resp]) => {
        return true;
      }).catch(err => {
          utils.writeErrorLog('recipeNotUsedScorer', 'insertInRecipeNotUsedScore', 'Error while updating recipe not used scorer in database', err, queryParam);
          return true;
      })
    }
  } catch (error) {
    utils.writeErrorLog('recipeNotUsedScorer', 'insertInRecipeNotUsedScore', 'Error while updating recipe not used scorer in database', error);
  }
}

// Function to get recipe pool after assiging recipe not used scorer to all recipe
const get = async (recipePool, userData) => {
  utils.writeInsideFunctionLog('recipeNotUsedScorer', 'get', recipePool);
  const noScore = 0;
  let queryParam = dbQuery.selectQuery(constant['DB_TABLE']['RECIPE_NOT_USED_SCORE'], ['recipe_id as id', 'score'], {user_id: userData.id});
  return await pool.query(queryParam)
  .then(([resp]) => {
    recipePool.forEach(recipe => {
      const matchRecipe = resp.find(response => response.id === recipe.id);
      recipe['recipeNotUsedScore'] = matchRecipe ? matchRecipe.score : 0;
    });
    return recipePool;
  }).catch(err => {
    utils.writeErrorLog('recipeNotUsedScorer', 'get', 'Error while assigning recipe not used scorer to recipes', err, queryParam);
    recipePool.forEach(recipe => recipe['recipeNotUsedScore'] = noScore);
    return recipePool;
  });
};

module.exports = {
  insertInRecipeNotUsedScore,
  get
}