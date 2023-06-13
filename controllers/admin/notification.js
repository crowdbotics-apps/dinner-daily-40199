const rfr = require('rfr');

const notificationModel = rfr('/models/admin/notification');
const utils = rfr('/shared/utils');

const getNotification = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  notificationModel.getNotification(req, res, cb);
}

const addNotification = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  notificationModel.addNotification(req, res, cb);
}

const deleteNotification = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  notificationModel.deleteNotification(req, res, cb);
}

const updateNotification = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  notificationModel.updateNotification(req, res, cb);
}

module.exports =  {
  getNotification,
  addNotification,
  updateNotification,
  deleteNotification
}
