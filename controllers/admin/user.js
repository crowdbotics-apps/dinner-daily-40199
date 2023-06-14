const rfr = require('rfr');
const adminUserModel = rfr('/models/admin/user');
const utils = rfr('/shared/utils');

const addUser = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminUserModel.addUser(req, res, cb);
}

const updateUser = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminUserModel.updateUser(req, res, cb);
}

const userList =(req, res)=>{
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  adminUserModel.userList(req, res, cb);
}

const deleteUser =(req, res)=>{
  let cb = function(result) {
      utils.sendResponse(res, result);
    }
    adminUserModel.deleteUser(req, res, cb);
}

const adminDasboard =(req, res)=>{
  let cb = function(result) {
      utils.sendResponse(res, result);
    }
    adminUserModel.dashBoardData(req, res, cb);
}

module.exports = {
    addUser,
    userList,
    updateUser,
    deleteUser,
    adminDasboard
}
