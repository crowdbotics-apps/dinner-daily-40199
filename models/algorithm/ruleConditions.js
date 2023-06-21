const rfr = require("rfr");
const pool = rfr('/db/index');

const dbQuery = rfr('/shared/query');
const utils = rfr("/shared/utils");
const constant = rfr("/shared/constant");


const _createCountWiseObject = (object) => {
  const countWiseObject = {};
  for (const key in object) {
    object[key].forEach((item) => {
      const count = item.count;
      if (!countWiseObject[count]) {
        countWiseObject[count] = {};
      }
      if (!countWiseObject[count][key]) {
        countWiseObject[count][key] = [];
      }
      countWiseObject[count][key].push(item.value);
    });
  }

  return countWiseObject;
}

const _mergedRuleCount = (object) => {
  const mergedObject = {};

  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      for (const prop in object[key]) {
        if (object[key].hasOwnProperty(prop)) {
          if (!mergedObject[prop]) {
            mergedObject[prop] = object[key][prop].map((item) => {
              return {
                value: item.value,
                count: 1
              };
            });
          } else {
            object[key][prop].forEach((item) => {
              const index = mergedObject[prop].findIndex((mergedItem) => mergedItem.value === item.value);
              if (index !== -1) {
                mergedObject[prop][index].count++;
              } else {
                mergedObject[prop].push({
                  value: item.value,
                  count: 1
                });
              }
            });
          }
        }
      }
    }
  }
  return _createCountWiseObject(mergedObject);
}

const _ruleCount = (inputObject) => {

  const finalObject = {};
  for (const key in inputObject) {
    const innerArray = inputObject[key];

    const outputObject = {};
    for (const obj of innerArray) {
      for (const prop in obj) {
        if (obj[prop] === null || (Array.isArray(obj[prop]) && !obj[prop].length)) {
          if (!outputObject.hasOwnProperty(prop)) {
            outputObject[prop] = [];
          }
          continue;
        }

        if (!outputObject.hasOwnProperty(prop)) {
          outputObject[prop] = [];
          if (prop == 'tag_names' || prop == 'ingredient_tag_names') {
            obj[prop].forEach(item => outputObject[prop].push({ value: item, count: 1 }));
          } else {
            outputObject[prop].push({ value: obj[prop], count: 1 });
          }
        } else {
          if (prop == 'tag_names' || prop == 'ingredient_tag_names') {
            obj[prop].forEach(value => {
              let existingItem = outputObject[prop].find(item => item.value === value);
              if (!existingItem) {
                outputObject[prop].push({ value: obj[prop], count: 1 });
              }
            });
          } else {
            let existingItem = outputObject[prop].find(item => item.value === obj[prop]);
            if (!existingItem) {
              outputObject[prop].push({ value: obj[prop], count: 1 });
            }
          }
        }
      }
    }
    finalObject[key] = outputObject;
  }
  return _mergedRuleCount(finalObject);

}

// Function to fetch rule set which need to apply on recipes to eliminate them from recipe pool based on the selected recipe
const get = async (selectedRecipe = []) => {
  utils.writeInsideFunctionLog('ruleConditions', 'get', selectedRecipe);

  if (!!selectedRecipe.length) {
    const selectedRecipeIds = selectedRecipe.map(recipe => recipe.id);
    let queryParam = dbQuery.selectInQuery(constant["DB_VIEW"]["RECIPE_INGREDIENTS_VIEW"], 'id', selectedRecipeIds, ["id", "tag_names", "ingredient_tag_names", "category_ids", "ingredient_id", "cooking_type"]);
    return await pool.query(queryParam)
    .then(([res]) => {
      let resp = res.map(item => {
        return {
          ...item,
          tag_names: item.tag_names ? item.tag_names.split(',') : [],
          ingredient_tag_names: item.ingredient_tag_names ? item.ingredient_tag_names.split(',') : []
        };
      });
      const result = resp.reduce((acc, item) => {
        const { id } = item;
        if (!acc[id]) {
          acc[id] = [];
        }
        acc[id].push(item);
        return acc;
      }, {});

      return _ruleCount(result);
    }).catch(err => {
      utils.writeErrorLog('ruleConditions', 'get', 'Error while fetching data for selected recipes', err, queryParam);
      return {};
    })
  } else {
    return {};
  }

};

module.exports = {
  get,
};
