const rfr = require('rfr');

const pool = rfr('/db/index');
const constant = rfr('/shared/constant');
const helper = rfr("/shared/helper");
const utils = rfr('/shared/utils');
const dbQuery = rfr('/shared/query');

// Function to check if file already exist in database and firebase
const _checkAndDeleteExistingFile = async (bonusId, files) => {
  utils.writeInsideFunctionLog('siteContent', '_checkAndDeleteExistingFile', bonusId);
  try {
    const queryParam = dbQuery.selectQuery(constant['DB_TABLE']['BONUS_CONTENT'], ['content', 'icon'], {id: bonusId});
    await pool.query(queryParam).then(async resp => {
      if (!!files['content'] && !!resp[0][0]['content']) {
        await utils.deleteFileInFirebase(resp[0][0]['content']);
      }
      if (!!files['icon'] && !!resp[0][0]['icon']) {
        await utils.deleteFileInFirebase(resp[0][0]['icon']);
      }
    }).catch(err => {
      utils.writeErrorLog('siteContent', '_checkAndDeleteExistingFile', 'Error while fetching existing bonus content data from database', err, queryParam);
      throw err;
    });
  } catch (error) {
    throw error;
  }
}

// Function to update bonus content data in database
const _updateBonusContent = async (reqObj, bonusId, cb) => {
  let resObj = Object.assign({}, utils.getErrorResObj());
  const queryParam = dbQuery.updateQuery(constant['DB_TABLE']['BONUS_CONTENT'], reqObj, {id: bonusId});
    await pool.query(queryParam).then(async(resp) => {
      resObj = Object.assign({ data: reqObj}, utils.getSuccessResObj());
      cb(resObj);
    }).catch(err => {
      resObj['message'] = constant['OOPS_ERROR'];
      resObj['data'] = err.message || err;
      utils.writeErrorLog('siteContent', 'updateBonusContent', 'Error while updating bonus content data in database', err, queryParam);
      cb(resObj);
    });
}

// Function to fetch bonus content from database with signedURL
const bonusContent = async (req, res, cb) => {
  utils.writeInsideFunctionLog('siteContent', 'bonusContent');
  let resObj = Object.assign({}, utils.getErrorResObj());
  let queryParam = dbQuery.selectQuery(constant['DB_TABLE']['BONUS_CONTENT']);
  await pool.query(queryParam).then(async ([resp]) => {
    if (resp.length) {
      for (let i = 0; i < resp.length; i++) {
        if (!!resp[i]['content']) {
          let url = await utils.getSignedURLFromFirebase(resp[i]['content']);
          resp[i]['content'] = url;
        }
        if (!!resp[i]['icon']) {
          let url = await utils.getSignedURLFromFirebase(resp[i]['icon']);
          resp[i]['icon'] = url;
        }
      }
      resObj = Object.assign({data: resp}, utils.getSuccessResObj());
      cb(resObj);
    } else {
      resObj = Object.assign({data: []}, utils.getSuccessResObj());
      cb(resObj);
    }
  }).catch(err => {
    resObj['message'] = constant['OOPS_ERROR'];
    resObj['data'] = err.message || err;
    utils.writeErrorLog('siteContent', 'bonusContent', 'Error while fetching bonus content data from database', err, queryParam);
    cb(resObj);
  });
}

// Function to fetch bonus content from database
const getBonusContent = async (req, res, cb) => {
  utils.writeInsideFunctionLog('siteContent', 'getBonusContent');
  let resObj = Object.assign({}, utils.getErrorResObj());
  let queryParam = dbQuery.selectQuery(constant['DB_TABLE']['BONUS_CONTENT']);
  await pool.query(queryParam).then(async ([resp]) => {
    resObj = Object.assign({data: resp}, utils.getSuccessResObj());
    cb(resObj);
  }).catch(err => {
    resObj['message'] = constant['OOPS_ERROR'];
    resObj['data'] = err.message || err;
    utils.writeErrorLog('siteContent', 'getBonusContent', 'Error while fetching bonus content data from database', err, queryParam);
    cb(resObj);
  });
}

// Function to add new bonus content
const addBonusContent = async (req, res, cb) => {
  utils.writeInsideFunctionLog('siteContent', 'addBonusContent');
  let resObj = Object.assign({}, utils.getErrorResObj());
  if (!!req.body['title']) {
    const reqObj = {
      title: req.body['title'],
      created: helper.getDateAndTime()
    }
    const { columns, valuesArr } = utils.formatRequestDataForInsert([reqObj]);
    const queryParam = dbQuery.insertQuery(constant['DB_TABLE']['BONUS_CONTENT'], columns);
    await pool.query(queryParam, [valuesArr]).then(async(resp) => {
      resObj = Object.assign({ data: {id: resp[0]['insertId'], ...reqObj}}, utils.getSuccessResObj());
      cb(resObj);
    }).catch(err => {
      resObj['message'] = constant['OOPS_ERROR'];
      resObj['data'] = err.message || err;
      utils.writeErrorLog('siteContent', 'addBonusContent', 'Error while saving bonus content data in database', err, queryParam);
      cb(resObj);
    });
  } else {
    resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
    return cb(resObj);
  }
}

// Function to update bonus content data in database and upload new file to firebase and delete existing one
const updateBonusContent = async (req, res, cb) => {
  utils.writeInsideFunctionLog('siteContent', 'updateBonusContent');
  let resObj = Object.assign({}, utils.getErrorResObj());
  const bonusId = req.params.id;
  let promiseArr = [];
  try {
    const reqObj = {
      button_title: req.body.button_title,
      updated: helper.getDateAndTime()
    }
    if (!!req.files && !!Object.keys(req.files).length) {
      !!req.files['content'] && promiseArr.push(utils.uploadFileOnFirebase(req.files['content'][0], 'pdf'));
      !!req.files['icon'] && promiseArr.push(utils.uploadFileOnFirebase(req.files['icon'][0], 'image'));
      await Promise.all(promiseArr)
      .then(async (resp) => {
        if (!!req.files['content']) {
          reqObj['content'] = resp[0];
          if (!!req.files['icon'])
            reqObj['icon'] = resp[1];
        } else if (!!req.files['icon']) {
          reqObj['icon'] = resp[0];
        }
        await _checkAndDeleteExistingFile(bonusId, req.files);
        _updateBonusContent(reqObj, bonusId, cb);
      })
      .catch((error) => {
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = error.message || error;
        utils.writeErrorLog('siteContent', 'updateBonusContent', 'Error while saving file at firebase', error);
        cb(resObj);
      });
    } else {
      _updateBonusContent(reqObj, bonusId, cb);
    }
  } catch (error) {
    resObj['message'] = constant['OOPS_ERROR'];
    resObj['data'] = error.message || error;
    utils.writeErrorLog('siteContent', 'updateBonusContent', 'Error while updating data in database', error);
    return cb(resObj);
  }
}

// Function to upload site content from database
const uploadContent = async (req, res, cb) => {
  utils.writeInsideFunctionLog('siteContent', 'uploadContent');
  let resObj = Object.assign({}, utils.getErrorResObj());
  let queryParam = dbQuery.selectQuery(constant['DB_TABLE']['UPLOAD_CONTENT']);
  await pool.query(queryParam).then(async resp => {
    resObj = Object.assign({ data: resp[0] }, utils.getSuccessResObj());
    cb(resObj);
  }).catch(err => {
    resObj['message'] = constant['OOPS_ERROR'];
    resObj['data'] = err.message || err;
    utils.writeErrorLog('siteContent', 'uploadContent', 'Error while fetching upload content data from database', err, queryParam);
    cb(resObj);
  });
}

// Function to update site content in database
const updateUploadContent = async (req, res, cb) => {
  utils.writeInsideFunctionLog("siteContent", "updateUploadContent", req.body);
  resObj = Object.assign({}, utils.getErrorResObj());
  if (helper.notEmpty(req.body?.title) && helper.notEmpty(req.body?.content) && helper.notEmpty(req.params.id)) {
    const updateData = {...req.body, updated: helper.getDateAndTime()}
    const queryParam = dbQuery.updateQuery(constant['DB_TABLE']['UPLOAD_CONTENT'], updateData, { id:req.params.id });
    await pool.query(queryParam).then(resp => {
      resObj = Object.assign({ data: updateData }, utils.getSuccessResObj());
      resObj['message'] = constant['UPDATE_SUCCESS_MSG'];
      cb(resObj);
    }).catch(err => {
      resObj['message'] = constant['OOPS_ERROR'];
      resObj['data'] = err.message || err;
      utils.writeErrorLog("siteContent", "updateUploadContent", 'Error while updating site content', err, queryParam);
      cb(resObj);
    })
  } else {
    resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
    cb(resObj);
  }
}



module.exports = {
  bonusContent,
  getBonusContent,
  addBonusContent,
  updateBonusContent,
  uploadContent,
  updateUploadContent
}