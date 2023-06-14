const rfr = require('rfr');

const homeModel = rfr('/models/home');
const utils = rfr('/shared/utils');

const homeContent = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  homeModel.homeContent(req, res, cb);
}

const static = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  homeModel.static(req, res, cb);
}

module.exports = {
    homeContent,
    static
}
