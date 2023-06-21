const rfr = require("rfr");
const pool = rfr('/db/index');

const dbQuery = rfr('/shared/query');
const utils = rfr("/shared/utils");
const constant = rfr("/shared/constant");

// Function to get recipes after applying all rule set
const get = async (recipePool, rules) => {
  utils.writeInsideFunctionLog('recipePool', 'get', recipePool);
  utils.writeInsideFunctionLog('recipePool', 'get', rules);
  const promiseArray = [];
  let queryParam = '';
  Object.keys(rules).forEach(type => {
    switch (type) {
      case constant['RULE_TYPE']['RECIPE_TAG']:
        queryParam = dbQuery.multipleSearchQuery(constant["DB_TABLE"]["RECIPES"], 'tag_names', rules[type], ["id"]);
        break;
      case constant['RULE_TYPE']['INGREDIENT_TAG']:
        queryParam = dbQuery.multipleSearchQuery(constant["DB_VIEW"]["RECIPE_INGREDIENTS_VIEW"], 'ingredient_tag_names', rules[type], ["id"]);
        break;
      case constant['RULE_TYPE']['INGREDIENT_CATEGORY']:
        queryParam = dbQuery.selectInQuery(constant["DB_VIEW"]["RECIPE_INGREDIENTS_VIEW"], 'category_ids', rules[type], ["id"]);
        break;
      case constant['RULE_TYPE']['INGREDIENT']:
        queryParam = dbQuery.selectInQuery(constant["DB_VIEW"]["RECIPE_INGREDIENTS_VIEW"], 'ingredient_id', rules[type], ["id"]);
        break;
      case constant['RULE_TYPE']['COOKING_TYPE']:
        queryParam = dbQuery.selectInQuery(constant["DB_TABLE"]["RECIPES"], 'cooking_type', rules[type], ["id"]);
        break;
      case constant['RULE_TYPE']['SATURATED_FAT']:
        queryParam = dbQuery.selectInQuery(constant["DB_VIEW"]["RECIPE_INGREDIENTS_VIEW"], 'saturated_fats', rules[type], ["id"]);
        break;
      case constant['RULE_TYPE']['SODIUM']:
        queryParam = dbQuery.selectInQuery(constant["DB_VIEW"]["RECIPE_INGREDIENTS_VIEW"], 'sodium', rules[type], ["id"]);
        break;
      case constant['RULE_TYPE']['MATCH_ANY']:
        // queryParam = dbQuery.selectQuery(constant["DB_TABLE"]["RECIPES"], ["type", "rule_id"], { value: index, yaml_key: `'${ruleKey}'` });
        break;
      case constant['RULE_TYPE']['MATCH_ALL']:
        // queryParam = dbQuery.selectQuery(constant["DB_TABLE"]["RECIPES"], ["type", "rule_id"], { value: index, yaml_key: `'${ruleKey}'` });
        break;
      default:
        break;
      }
      if (!!queryParam && !!recipePool.length) {
        queryParam += ` and id in (${recipePool})`;
        promiseArray.push(pool.query(queryParam));
      }
  });

  return await Promise.all(promiseArray).then((res) => {
    let recipeArr = [];
    res.forEach(result => (recipeArr = recipeArr.concat(...result[0])));
    let recipeIdArr = recipeArr.map(recipe => recipe.id);
    const finalRecipeArr = recipePool.filter(recipeId => !recipeIdArr.includes(recipeId));
    if (!!finalRecipeArr.length) {
      return finalRecipeArr;
    } else {
      return recipePool;
    }
  }).catch(err => {
      utils.writeErrorLog('recipePool', 'get', 'Error while fetching recipes which are needed to exclude from recipe pool', err);
      throw err;
  });
};

module.exports = {
  get,
};
