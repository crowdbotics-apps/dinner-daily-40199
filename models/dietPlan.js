const rfr = require('rfr');

const pool = rfr('/db/index');
const constant = rfr('/shared/constant');
const utils = rfr('/shared/utils');
const helper = rfr('/shared/helper');
const dbQuery = rfr('/shared/query');
const algorithmModel = rfr('/models/algorithm/menuGenerator');
const userMenuModel = rfr('/models/userMenu');

// Function to format user diet plan option to save in db
const _formatUserDietOptions = async (userOptions, userId) => {
  const queryParam = dbQuery.selectQuery(constant.DB_TABLE.DIET_PLAN_OPTIONS);
  try {
    const result = await pool.query(queryParam);
    let userDietPlanArr = [];
    result[0].forEach(ele => {
      if (ele.enabled) {
        let userDietPlanObj = {};
        const name = helper.dietPlanMapping[ele.internal_id];
        userDietPlanObj.diet_plan_option_id = ele.id;
        userDietPlanObj.value = ele.type === 'numeric' ? userOptions.foodPreference[name] : 0;
        userDietPlanObj.checked = ele.type === 'boolean' ? Number(!!userOptions.dietryNeed[name]) : 0;
        userDietPlanObj.user_id = userId;
        userDietPlanObj.created = helper.getDateAndTime();
        userDietPlanArr.push(userDietPlanObj);
      }
    });
    return userDietPlanArr;
  } catch (err) {
    utils.writeErrorLog('dietPlan', '_formatUserOptions', 'Error while fetching diet plan otpions', err, queryParam);
    throw err;
  }
};

// Function to format user diet plan option to update in db
const _formatUserDietObj = async (userOptions, userId) => {
  const queryParam = dbQuery.fetchUserQuery(userId);
  try {
    const result = await pool.query(queryParam);
    let userDietPlanArr = [];
    result[0].forEach(ele => {
      let userDietPlanObj = {};
      const name = helper.dietPlanMapping[ele.internal_id];
      userDietPlanObj.id = ele.uid;
      userDietPlanObj.value = ele.type === 'numeric' ? userOptions.foodPreference[name] : 0;
      userDietPlanObj.checked = ele.type === 'boolean' ? Number(!!userOptions.dietryNeed[name]) : 0;
      userDietPlanObj.user_id = userId;
      userDietPlanObj.created = 'now()';
      userDietPlanArr.push(userDietPlanObj);
    });
    return userDietPlanArr;
  } catch (err) {
    utils.writeErrorLog('dietPlan', '_formatUserDietOptions', 'Error while fetching diet plan otpions', err, queryParam);
    throw err;
  }
};

// Function to format user diet plan object for user table
const _formatUserUpdateObj = reqBody => {
  let updateObj = {};
  if (reqBody.dietryNeed && reqBody.dietryNeed.hasOwnProperty('heartHealthy')) {
    updateObj.heart_healthy = Number(!!reqBody.dietryNeed.heartHealthy);
  }
  if (reqBody.hasOwnProperty('familySize')) {
    updateObj.family_size = reqBody.familySize;
  }
  if (reqBody.hasOwnProperty('state')) {
    updateObj.state = reqBody.state;
  }
  if (reqBody.hasOwnProperty('store')) {
    updateObj.preferred_store_id = reqBody.store;
  }
  return updateObj;
};


// Function to fetch user diet plan
const getUserDietPlan = async (req, res, cb) => {
  utils.writeInsideFunctionLog('dietPlan', 'getUserDietPlan');

  let userId = req.userData.id;
  let resObj = Object.assign({}, utils.getErrorResObj());
  const queryParam = dbQuery.fetchUserQuery(userId);
  await pool
    .query(queryParam)
    .then(([resp]) => {
      if (!!resp.length) {
        const respObj = helper.formatDietPlanOptions(resp);

        resObj = Object.assign({ data: respObj }, utils.getSuccessResObj());
        cb(resObj);
      } else {
        resObj.code = constant.RES_OBJ.CODE.NOT_FOUND;
        resObj.message = constant.RES_OBJ.MSG.NOT_FOUND;
        cb(resObj);
      }
    })
    .catch(err => {
      resObj.message = constant.OOPS_ERROR;
      resObj.data = err.message || err;
      utils.writeErrorLog('dietPlan', 'getUserDietPlan', 'Error while fetching user diet plan otpions', err, queryParam);
      cb(resObj);
    });
};

// Function to save user diet plan selected during onboarding process
const dietPlanOptions = async (req, res, cb) => {
  utils.writeInsideFunctionLog('dietPlan', 'dietPlanOptions', req.body);

  let userId = req.userData.id;
  let resObj = Object.assign({}, utils.getErrorResObj());
  const dietPlanArr = await _formatUserDietOptions(req.body, userId);
  const updateUserObj = _formatUserUpdateObj(req.body);
  const { columns, valuesArr } = utils.formatRequestDataForInsert(dietPlanArr);
  const insertQueryParam = dbQuery.insertQuery(constant.DB_TABLE.USER_DIET_PLAN_OPTIONS, columns);
  const updateQueryParam = dbQuery.updateQuery(constant.DB_TABLE.USERS, updateUserObj, { id: userId });
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    conn.query(updateQueryParam);
    conn.query(insertQueryParam, [valuesArr])
      .then(async res => {
        await conn.query('COMMIT');
        const userMenu = await algorithmModel.createMenu(req.userData, 'create');
        await userMenuModel.insertDataInUserWeekMenu(userId, userMenu, req.body.store, req.body.familySize);
        await conn.query('COMMIT');
        await conn.release();
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj['message'] = constant['SUCCESS_MSG'];
        cb(resObj);
      })
      .catch(async err => {
        const deleteQueryParam = dbQuery.deleteQuery(constant.DB_TABLE.USER_DIET_PLAN_OPTIONS, { user_id: userId })
        await conn.query(deleteQueryParam);
        await conn.query('COMMIT');
        await conn.query('ROLLBACK');
        await conn.release();
        resObj['message'] = err.message || err;
        utils.writeErrorLog('dietPlan', 'dietPlanOptions', 'Error while saving user diet plan otpions', err, insertQueryParam);
        cb(resObj);
      });
  } catch (error) {
    await conn.query('ROLLBACK');
    await conn.release();
    resObj['message'] = constant['OOPS_ERROR'];
    resObj['data'] = error.message || error;
    utils.writeErrorLog('dietPlan', 'dietPlanOptions', 'Error during creation of pool transaction', error);
    cb(resObj);
  }
};

// Function to update user diet plan options
const updateUserDietPlan = async (req, res, cb) => {
  utils.writeInsideFunctionLog('dietPlan', 'updateUserDietPlan', req.body);
  const userId = req.userData.id;
  let resObj = Object.assign({}, utils.getErrorResObj());
  const updateUserObj = _formatUserUpdateObj(req.body);
  const updateDietPlanObj = await _formatUserDietObj(req.body, userId);
  const updateUserQueryParam = dbQuery.updateQuery(constant.DB_TABLE.USERS, updateUserObj, { id: userId });
  const userDietQueryParam = dbQuery.updateWithDuplicateKeyQuery(constant.DB_TABLE.USER_DIET_PLAN_OPTIONS, updateDietPlanObj, ['value', 'checked']);
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    conn.query(updateUserQueryParam);
    conn
      .query(userDietQueryParam)
      .then(async res => {
        await conn.query('COMMIT');
        const userMenu = await algorithmModel.createMenu(req.userData);
        await userMenuModel.updateUserWeekDayMenu(userId, userMenu, req.body.store, req.body.familySize);
        await conn.release();
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj.message = constant.UPDATE_SUCCESS_MSG;
        cb(resObj);
      })
      .catch(async err => {
        await conn.query('ROLLBACK');
        await conn.release();
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = err.message || err;
        utils.writeErrorLog('dietPlan', 'dietPlanOptions', 'Error while updating user diet plan otpions', err, userDietQueryParam);
        cb(resObj);
      });
  } catch (error) {
    await conn.query('ROLLBACK');
    await conn.release();
    resObj['message'] = constant['OOPS_ERROR'];
    resObj['data'] = error.message || error;
    utils.writeErrorLog('dietPlan', 'updateUserDietPlan', 'Error while updating user diet plan otpions', error);
    cb(resObj);
  }
};

module.exports = {
  getUserDietPlan,
  dietPlanOptions,
  updateUserDietPlan,
};
