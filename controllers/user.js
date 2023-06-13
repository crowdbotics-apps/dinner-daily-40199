const rfr = require('rfr');
const userModel = rfr('/models/user');
const utils = rfr('/shared/utils');

const login = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  userModel.login(req, res, cb);
}

const socialLogin = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  userModel.socialLogin(req, res, cb);
}

const signUp = (req, res) => {
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  userModel.signUp(req, res, cb);
}

const changePassword =(req, res)=>{
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  userModel.changePassword(req, res, cb);
}

const logout = (req, res)=>{
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  userModel.logout(req, res, cb);
}

const forgotPassword = (req, res)=>{
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  userModel.forgotPassword(req, res, cb);
}

function resetPassword(req, res) {
  var cb = function(result) {
    utils.sendResponse(res, result);
  }
  userModel.resetPassword(req, res, cb);
}

const inviteFriend = (req, res)=>{
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  userModel.inviteFriend(req, res, cb);
}

const accountSetting = (req, res)=>{
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  userModel.accountSetting(req, res, cb);
}
const supportFeedback = (req, res)=>{
  let cb = function(result) {
    utils.sendResponse(res, result);
  }
  userModel.supportFeedback(req, res, cb);
}


module.exports = {
  login,
  socialLogin,
  signUp,
  changePassword,
  logout,
  forgotPassword,
  resetPassword,
  inviteFriend,
  accountSetting,
  supportFeedback,
}
