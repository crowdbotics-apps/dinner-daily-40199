const rfr = require("rfr");
const pool = rfr("/db/index");

const dbQuery = rfr("/shared/query");
const helper = rfr("/shared/helper");
const constant = rfr("/shared/constant");
const utils = rfr("/shared/utils");

// Function to fetch user dietPlan options
const _userDietPlanOptions = async (userId) => {
  const queryParam = dbQuery.fetchUserQuery(userId);
  return await pool.query(queryParam)
  .then(([resp]) => {
    if (!!resp.length) {
      return helper.formatDietPlanOptions(resp);
    } else {
      utils.writeErrorLog('restrictionRules', '_userDietPlanOptions', 'User diet plan options not found', queryParam);
      throw constant['NO_RESOURCE_FOUND'];
    }
  }).catch(err => {
    utils.writeErrorLog('restrictionRules', '_userDietPlanOptions', 'Error while fetching user diet plan options', err, queryParam);
    throw err.message || err;
  })
}

// Function to fetch restriction rules from db
const _restrictionRulesFromDB = async () => {
  let queryParam = dbQuery.selectQuery(constant['DB_TABLE']['NEW_RESTRICTION_RULE_SETS']);
  return await pool.query(queryParam)
  .then(([resp]) => {
    return resp;
  }).catch((err) => {
    utils.writeErrorLog("restrictionRules", "_restrictionRulesFromDB", "Error while fetching restriction rule sets", err, queryParam);
    throw err.message || err;
  });
}

// Function to make a final set of user restrictions rule based on user selected dietPlan options
const _userRestrictionRuleSets = (dietPlanOptions, restrictionRules) => {
const userRuleSet = [];
  Object.keys(dietPlanOptions.foodPreference).forEach((item) => {
    const rules = restrictionRules.filter((rule) => {
      const ruleName = rule.name.toLowerCase().split(' ').join('');
      if (ruleName === item.toLowerCase()) {
        let value = dietPlanOptions.foodPreference[item];
        if (dietPlanOptions.foodPreference[item] === 2 && item !== 'vegetarian') {
          value = item === 'shellfish' ? 1 : 3;
        } else if (dietPlanOptions.foodPreference[item] === 3 && item === 'vegetarian') {
          value = 5;
        }
        rule.value = rule.value.replace('%value%', value);
        return rule;
      } else if ((ruleName === `${item.toLowerCase()}>0`) && !!dietPlanOptions.foodPreference[item]) {
        return rule;
      } else if (ruleName === `${item.toLowerCase()}=1` && dietPlanOptions.foodPreference[item] == 1) {
        return rule;
      } else if (ruleName === `${item.toLowerCase()}=2` && dietPlanOptions.foodPreference[item] == 2) {
        return rule;
      } else if (ruleName === `${item.toLowerCase()}>2` && dietPlanOptions.foodPreference[item] > 2) {
        return rule;
      } else if (ruleName === `no${item}` && !!dietPlanOptions.foodPreference[item]) {
        return rule;
      }
    });
    if (!!rules.length) {
      userRuleSet.push(...rules);
    }
  });
  Object.keys(dietPlanOptions.dietryNeed).forEach((item) => {
    if (!!dietPlanOptions.dietryNeed[item]) {
      const rule = restrictionRules.find((rule) => {
        const ruleName = rule.name.toLowerCase().split('-').join('');
        return (ruleName.split(' ').join('') === item.toLowerCase());
      });
      if (rule) {
        const matchedRules = restrictionRules.filter(rules => rules.name === rule.name);
        userRuleSet.push(...matchedRules);
      }
    }
  });
  return userRuleSet;
}

// Function to fetch all restrictions rule set for a user based on its diet plan option selection
const getAllRules = async (userId) => {
  utils.writeInsideFunctionLog('restrictionRules', 'getAllRules', userId);
  try {
    const userDietPlan = await _userDietPlanOptions(userId);
    const restrictionRules = await _restrictionRulesFromDB();
    const userRestrictionRuleSets = _userRestrictionRuleSets(userDietPlan, restrictionRules);
    return userRestrictionRuleSets;
  } catch (error) {
    utils.writeErrorLog('restrictionRules', 'getAllRules', 'Error while fetching user diet plan and rule sets', error);
    throw error.message || error;
  }
};

// Function to filter restrictions rule set for each iteration
const get = async (recipePoolArray, allRules, filterRuleConditions, ruleKey) => {
  utils.writeInsideFunctionLog('restrictionRules', 'get', allRules);
  utils.writeInsideFunctionLog('restrictionRules', 'get', filterRuleConditions);
  try {
    if (!!Object.keys(filterRuleConditions).length) {
      const filterRules = [];

      for (const countKey in filterRuleConditions) {
        const countValue = filterRuleConditions[countKey];
        for (const typeKey in countValue) {
          const typeValue = countValue[typeKey];
          const ruleType = helper.ruleTypeMapping[typeKey];
          if (ruleType) {
            for (const rule of allRules) {
              if (!recipePoolArray.length) {
                if (rule.type === ruleType && typeValue.includes(rule.rule_id) && rule.value === countKey && rule.yaml_key == ruleKey && rule.soft == null) {
                  filterRules.push(rule);
                }
              } else {
                if (ruleKey === constant['RULE_KEY']['MEAL_RULES'] || ruleKey === constant['RULE_KEY']['MAIN_AND_SIDE_DISH_RULES']) {
                  if (rule.type === ruleType && typeValue.includes(rule.rule_id) && rule.value < countKey && rule.yaml_key == ruleKey) {
                    filterRules.push(rule);
                  }
                }
                else {
                  if (rule.type === ruleType && typeValue.includes(rule.rule_id) && rule.value === countKey && rule.yaml_key == ruleKey) {
                    filterRules.push(rule);
                  }
                }
              }
            }
          }
        }
      }
      return helper.formatRules(filterRules);
    } else {
      const rules = allRules.filter(rule => (rule.value == 0 && rule.yaml_key == ruleKey));
      return helper.formatRules(rules);
    }
  } catch (error) {
    utils.writeErrorLog('restrictionRules', 'get', 'Error while filtering out restriction rule sets', error);
    throw error.message || error;
  }
};

module.exports = {
    getAllRules,
    get
};
