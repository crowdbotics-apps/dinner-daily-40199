const rfr = require('rfr');
const adminSiteContentModel = rfr('/models/admin/siteContent');
const utils = rfr('/shared/utils');

const bonusContent = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminSiteContentModel.bonusContent(req, res, cb);
}

const getBonusContent = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminSiteContentModel.getBonusContent(req, res, cb);
}

const addBonusContent = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminSiteContentModel.addBonusContent(req, res, cb);
}

const updateBonusContent = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminSiteContentModel.updateBonusContent(req, res, cb);
}

const uploadContent = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminSiteContentModel.uploadContent(req, res, cb);
}

const updateUploadContent = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminSiteContentModel.updateUploadContent(req, res, cb);
}

module.exports = {
  bonusContent,
  getBonusContent,
  addBonusContent,
  updateBonusContent,
  uploadContent,
  updateUploadContent
}

