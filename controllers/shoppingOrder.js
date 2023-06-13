const rfr = require('rfr');

const shoppingOrderModel = rfr('/models/shoppingOrder');
const utils = rfr('/shared/utils');


const fetchKrogerProducts = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  shoppingOrderModel.fetchKrogerProducts(req, res, cb);
}

module.exports = {
    fetchKrogerProducts
}
