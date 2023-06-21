const rfr = require("rfr");
const pool = rfr("/db/index");

const dbQuery = rfr("/shared/query");
const utils = rfr("/shared/utils");

const _addTieredScoreToEachIngredient = (recipeArr) => {
  const tier1Ingredient = 1;
  const tier2Ingredient = 2;
  const result = recipeArr.map(obj => {
    let tieredScore = 0;

    if (obj.is_on_sale === 1) {
      if (obj.tier === tier1Ingredient) {
        tieredScore = 100;
      } else if (obj.tier === tier2Ingredient) {
        tieredScore = 25;
      }
    }

    return { ...obj, tieredScore };
  });
  return result;
}

const _sumOfTieredScoreForEachRecipe = (recipeArr) => {
  const result = recipeArr.reduce((acc, obj) => {
    const { id, tieredScore } = obj;
    if (!acc[id]) {
      acc[id] = 0;
    }
    acc[id] += tieredScore;
    return acc;
  }, {});
  return result;
}

// Function to get recipe pool after assiging tiered ingredient sale scorer to all recipe
const get = async (userData, recipePool, recipePoolArray) => {
  utils.writeInsideFunctionLog('tieredIngredientSaleScorer', 'get', recipePool);
  if (!!recipePoolArray.length) {
    let queryParam = dbQuery.tieredIngredientSaleQuery(userData.preferred_store_id, recipePoolArray);
    return await pool.query(queryParam)
    .then(([resp]) => {
      const recipeIngredientWithTieredScore = _addTieredScoreToEachIngredient(resp);
      const recipeWithTieredScore = _sumOfTieredScoreForEachRecipe(recipeIngredientWithTieredScore);
      const recipeWithTieredIngredientSaleScore = recipePool.map((recipe) => ({
        ...recipe,
        tieredIngredientSaleScore: recipe.id in recipeWithTieredScore ? recipeWithTieredScore[recipe.id] : 0
      }));
      return recipeWithTieredIngredientSaleScore;
    }).catch(err => {
      utils.writeErrorLog('tieredIngredientSaleScorer', 'get', 'Error while assigning tiered ingredient scorer to recipes', err, queryParam);
      return recipePool;
    });
  } else {
    return recipePool;
  }


  return recipePool;
};

module.exports = {
  get,
};
