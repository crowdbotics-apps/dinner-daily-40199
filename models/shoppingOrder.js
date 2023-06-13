const rfr = require('rfr');
const axios = require("axios");

const pool = rfr('/db/index');

const constant = rfr('/shared/constant');
const utils = rfr('/shared/utils');
const dbQuery = rfr('/shared/query');
const config = rfr('/shared/config');
const helper = rfr('/shared/helper');

const clientId = config['kroger']['clientId'];
const clientSecret = config['kroger']['clientSecret'];

// Function to fetch access token from kroger
const _fetchAccessToken = async () => {
  return await axios({
    method: "post",
    url: `https://api.kroger.com/v1/connect/oauth2/token`,
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'product.compact'
    })
  })
  .then((response) => {
    return response.data.access_token;
  })
  .catch((err) => {
    utils.writeErrorLog('shoppingOrder', '_fetchAccessToken', 'Error while fetching access token from kroger', err);
    throw err.message || err;
  });

}

// Function to fetch kroger store near by user location by lattitude and longitude
const _fetchStore = async (reqQuery, accessToken) => {
  return await axios({
    method: "get",
    url: `https://api.kroger.com/v1/locations/?filter.lat.near=${reqQuery.lat}&filter.lon.near=${reqQuery.long}`,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    }
  })
  .then((response) => {
    const responseData = response.data.data;
    if (responseData && responseData.length) {
      return responseData[0]['locationId'];
    }
    throw constant['NO_STORE_FOUND'];
  })
  .catch((err) => {
    utils.writeErrorLog('shoppingOrder', '_fetchStore', 'Error while fetching kroger store by user location', err);
    throw err.message || err;
  });
}

// Function to fetch user shopping list item which is selected by user for make a order on kroger
const _fetchOrderListItems = async (userId, storeId) => {
  const queryParam = dbQuery.selectQuery(constant['DB_VIEW']['SHOPPING_LIST_ITEMS_VIEW'], [], {user_id: userId});
  return await pool.query(queryParam)
  .then(([items]) => {
    if (items && items.length) {
      const checkedItems = items.filter(item => item.checked_off === 1);
      if (checkedItems.length) {
        return checkedItems;
      }
      throw constant['NO_ITEM_SELECTED'];
    }
    throw constant['NO_ITEM_SELECTED'];
  }).catch(err => {
      utils.writeErrorLog('shoppingOrder', '_fetchOrderListItems', 'Error while fetching user ingredient in shopping list items', err, queryParam);
      throw err.message || err;
  });
}

const _isCategorMatched = (product, shoppingCategory) => {
  if (shoppingCategory === 'Other Stuff') {
    return true;
  }

  return product.categories.some((category) => helper.categoryMap[shoppingCategory].includes(category));

}

const _fetchProductFromKroger = async (accessToken, storeLocationId, selectedItemsForOrder) => {
  // Map over each ingredient in shopping list order and call the API for each ingredient, returning a promise
  const apiCalls = selectedItemsForOrder.map(ingredient => {
    let ingredientName = ingredient.searh_term || ingredient.ingredient_name;
    return axios({
      method: "get",
      url: `https://api.kroger.com/v1/products?filter.locationId=${storeLocationId}&filter.term=${ingredientName}&filter.fulfillment=ais`,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
  });

  // Use Promise.all() to run all API calls in parallel
  return await Promise.all(apiCalls)
    .then(results => {
      let matchedProduct = [];
      let unmatchedProduct = [];
      for (let i = 0; i < results.length; i++ ) {
        const resultData = results[i].data.data;
        if (!!resultData.length) {
          for (let product of resultData) {
            if (_isCategorMatched(product, selectedItemsForOrder[i].name)) {
              matchedProduct.push({
                productId: product.productId,
                upc: product.upc,
                name: product.description,
                quantity: Math.ceil(selectedItemsForOrder[i].amount) || 1
              });
              break;
            } else {
              unmatchedProduct.push(selectedItemsForOrder[i].ingredient_name);
              break;
            }
          }
        } else {
          unmatchedProduct.push(selectedItemsForOrder[i].ingredient_name);
        }
      }
      return {matchedProduct, unmatchedProduct};
    })
    .catch(err => {
      utils.writeErrorLog('shoppingOrder', '_fetchProductFromKroger', 'Error while fetching productskroger by user location', err);
      throw err.message || err;
    });
}

// Function to fetch kroger store by user location
const fetchKrogerProducts = async (req, res, cb) => {
  const reqQuery = req.query;
	utils.writeInsideFunctionLog('shoppingOrder', 'fetchKrogerProducts', reqQuery);
  let resObj = Object.assign({}, utils.getErrorResObj());
  try {
    if (!!reqQuery.lat && !!reqQuery.long) {
      let accessToken = await _fetchAccessToken();
      let locationId = await _fetchStore(reqQuery, accessToken);
      let selectedItemsForOrder = await _fetchOrderListItems(req.userData.id, req.userData.preferred_store_id);
      let krogerProduct = await _fetchProductFromKroger(accessToken, locationId, selectedItemsForOrder);
      resObj = Object.assign({data: krogerProduct}, utils.getSuccessResObj());
      cb(resObj);
    } else {
      resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
      cb(resObj);
    }
  } catch (err) {
    resObj['message'] = err;
    cb(resObj);
  }
}


module.exports = {
  fetchKrogerProducts
}