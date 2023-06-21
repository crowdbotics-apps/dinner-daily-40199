const rfr = require("rfr");
const utils = rfr("/shared/utils");

// Function to get final rule set to apply on recipes pool
const get = (balanceRuleSets, restrictionRuleSets) => {
  utils.writeInsideFunctionLog('finalRules', 'get', balanceRuleSets);
  utils.writeInsideFunctionLog('finalRules', 'get', restrictionRuleSets);
  const finalRules = { ...balanceRuleSets };

  for (const key in restrictionRuleSets) {
    if (finalRules[key]) {
      finalRules[key] = finalRules[key].concat(restrictionRuleSets[key]);
    } else {
      finalRules[key] = restrictionRuleSets[key];
    }
  }
  return finalRules;
};

module.exports = {
  get,
};
