const rfr = require('rfr');

const algorithmModel = rfr('/models/algorithm/menuGenerator');
const utils = rfr('/shared/utils');

const createUserMenu = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  algorithmModel.createUserMenu(req, res, cb);
}


module.exports = {
  createUserMenu
}
