const rfr = require("rfr");
const pool = rfr("/db/index");

const dbQuery = rfr("/shared/query");
const utils = rfr("/shared/utils");
const constant = rfr("/shared/constant");


const _addBalanceScore = async (recipePool, ingredientBalanceArr) => {
  if (!!recipePool.length) {
    const recipePoolIdArr = recipePool.map(recipe => recipe.id);
    const queryParam = dbQuery.selectInQuery(constant["DB_VIEW"]["RECIPE_INGREDIENTS_VIEW"], "id", recipePoolIdArr, []);
    return await pool.query(queryParam).then((res) => {
      res[0].forEach(recipe => {
        recipe['balanceScore'] = 0;
        const matchingObj = ingredientBalanceArr.find(obj => obj.category_ids === recipe.category_ids);
        if (matchingObj) {
          recipe['balanceScore'] = Math.floor((0 - matchingObj.count * 20 / 100) * 400);
        }
      });
      return res[0];
    }).catch(err => {
      utils.writeErrorLog('ingredientBalanceScorer', '_addBalanceScore', 'Error while adding ingredient balance score', err);
      return recipePool;
    });
  } else {
    return recipePool;
  }
}

const _sumOfIngredientBalanceScoreForEachRecipe = (recipeArr) => {
  const result = recipeArr.reduce((acc, obj) => {
    const { id, balanceScore } = obj;
    if (!acc[id]) {
      acc[id] = 0;
    }
    acc[id] += balanceScore;
    return acc;
  }, {});
  return result;
}

// Function to get recipe pool after assiging favorite scorer to all recipe
const get = async (recipePool, selectedRecipe) => {
  utils.writeInsideFunctionLog('ingredientBalanceScorer', 'get', recipePool);
  utils.writeInsideFunctionLog('ingredientBalanceScorer', 'get', selectedRecipe);

  if (!!selectedRecipe.length) {
    const selectedRecipeIds = selectedRecipe.map(recipe => recipe.id);
    let queryParam = dbQuery.ingredientBalanceQuery(selectedRecipeIds);
    return await pool.query(queryParam)
    .then(async ([resp]) => {
      const recipeIngredientWithBalanceScore = await _addBalanceScore(recipePool, resp);
      recipeWithBalanceScore = _sumOfIngredientBalanceScoreForEachRecipe(recipeIngredientWithBalanceScore);
      const recipeWithIngredientBalanceSaleScore = recipePool.map((recipe) => ({
        ...recipe,
        ingredientBalanceScore: recipe.id in recipeWithBalanceScore ? recipeWithBalanceScore[recipe.id] : 0
      }));
      return recipeWithIngredientBalanceSaleScore;
    }).catch(err => {
      utils.writeErrorLog('ingredientBalanceScorer', 'get', 'Error while assigning favorite scorer to recipes', err, queryParam);
    })
  } else {
    recipePool.forEach(recipe => recipe['ingredientBalanceScore'] = 0);
    return recipePool;
  }
};

module.exports = {
  get,
};
