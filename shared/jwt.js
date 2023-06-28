const rfr = require("rfr")
const jwt = require("jsonwebtoken");

const config = rfr("/shared/config");
const dbQuery = rfr("/shared/query");
const constant = rfr("/shared/constant");
const utils = rfr("/shared/utils");
const pool = rfr("/db/index");

/** Used to check valid authorization token provided in headers*/
const userAuthentication = (req, res, next) => {
  let token = req.headers['authorization'];
  console.log('User authentication token ->', token);
  let resObj = Object.assign({}, utils.getErrorResObj());
  /**check authorization token in header */
  if (!token) {
    resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
    resObj['message'] = constant["AUTH_FAIL"];
    return utils.sendResponse(res, resObj);
  }
  /** decode JWT Authorization token */
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log('Authentication error ->', err);
      resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
      resObj['message'] = constant["AUTH_FAIL"];
      return utils.sendResponse(res, resObj);
    }
    const selectQuery = dbQuery.selectQuery(constant['DB_TABLE']['USERS'], [], {id: decoded.id});
    /** check user account status i.e deleted or blocked or inactive */
    pool.query(selectQuery).then(results => {
      const result = results[0];
      if (result && result.length) {
        req.userData = result[0];
        if (!!req.userData.enabled) {
          return next();
        } else {
          resObj['message'] = constant["USER_INACTIVE_ACCOUNT"];
          return utils.sendResponse(res, resObj);
        }
      } else {
        resObj['message'] = constant["NO_RESOURCE_FOUND"];
        return utils.sendResponse(res, resObj);
      }
    }).catch((error) => {
      resObj['message'] = error.message || error;
      return utils.sendResponse(res, resObj);
    });
  });
};

const signIn = (userId) => {
  return jwt.sign({ id: userId }, config.secret);
}

const getTokenForForgotPassword = (obj) => {
  return jwt.sign(obj, config.secret, { expiresIn: '5m' });
}

module.exports = {
    userAuthentication,
    signIn,
    getTokenForForgotPassword
}