const rfr = require("rfr");
const pool = rfr("/db/index");

const dbQuery = rfr("/shared/query");
const helper = rfr("/shared/helper");
const constant = rfr("/shared/constant");
const utils = rfr("/shared/utils");

// Function to fetch balance rule set
const get = async (recipePoolArray, filterRuleConditions, ruleKey) => {
  utils.writeInsideFunctionLog('balanceRules', 'get', recipePoolArray);
  utils.writeInsideFunctionLog('balanceRules', 'get', filterRuleConditions);
  if (!!Object.keys(filterRuleConditions).length) {
    const promiseArray = [];
    let queryParam = '';
    for (const rules in filterRuleConditions) {
      for (const key in filterRuleConditions[rules]) {
        let condObj = {
          value: rules,
          yaml_key: `'${ruleKey}'`
        }
        if (ruleKey === constant['RULE_KEY']['MEAL_RULES'] || ruleKey === constant['RULE_KEY']['MAIN_AND_SIDE_DISH_RULES']) {
          delete condObj.value;
        }
        if (!recipePoolArray.length && !(ruleKey === constant['RULE_KEY']['MEAL_RULES'] || ruleKey === constant['RULE_KEY']['MAIN_AND_SIDE_DISH_RULES'])) {
          condObj['soft'] = null;
        }
        switch (key) {
          case 'tag_names':
            queryParam = dbQuery.multipleSearchQuery(constant["DB_TABLE"]["NEW_BALANCE_RULE_SETS"], 'rule_id', filterRuleConditions[rules][key], ["type", "rule_id"], {type: `'recipeTag'`, ...condObj});
            break;
          case 'ingredient_tag_names':
            queryParam = dbQuery.multipleSearchQuery(constant["DB_TABLE"]["NEW_BALANCE_RULE_SETS"], 'rule_id', filterRuleConditions[rules][key], ["type", "rule_id"], {type: `'ingredientTag'`, ...condObj});
            break;
          case 'category_ids':
            queryParam = dbQuery.selectInQuery(constant["DB_TABLE"]["NEW_BALANCE_RULE_SETS"], 'rule_id', filterRuleConditions[rules][key], ["type", "rule_id"], {type: `'ingredientCategory'`, ...condObj});
            break;
          case 'ingredient_id':
            queryParam = dbQuery.selectInQuery(constant["DB_TABLE"]["NEW_BALANCE_RULE_SETS"], 'rule_id', filterRuleConditions[rules][key], ["type", "rule_id"], {type: `'ingredient'`, ...condObj});
            break;
          case 'cooking_type':
            queryParam = dbQuery.selectInQuery(constant["DB_TABLE"]["NEW_BALANCE_RULE_SETS"], 'rule_id', filterRuleConditions[rules][key], ["type", "rule_id"], {type: `'cookingType'`, ...condObj});
            break;
          default:
            break;
          }
          if (!!queryParam) {
            if (ruleKey === constant['RULE_KEY']['MEAL_RULES'] || ruleKey === constant['RULE_KEY']['MAIN_AND_SIDE_DISH_RULES']) {
              queryParam += ` and value < ${rules} `;
            }
            promiseArray.push(pool.query(queryParam));
          }
      };
    }

    return await Promise.all(promiseArray).then((res) => {
      let ruleArray = [];
      res.forEach(result => (ruleArray = ruleArray.concat(...result[0])));
      return helper.formatRules(ruleArray);
    }).catch(err => {
        utils.writeErrorLog('balanceRules', 'get', 'Error while fetching required rules for each iteration', err);
        return [];
    });
  } else {
    let queryParam = dbQuery.selectQuery(constant["DB_TABLE"]["NEW_BALANCE_RULE_SETS"], ["type", "rule_id"], { value: 0, yaml_key: `'${ruleKey}'` });
    return await pool
        .query(queryParam)
        .then(([resp]) => {
          return helper.formatRules(resp);
        })
        .catch((err) => {
          utils.writeErrorLog("balanceRules", "get", "Error while fetching balance rule sets", err, queryParam);
          return [];
      });
  }
};

module.exports = {
    get,
};
