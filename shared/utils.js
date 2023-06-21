const rfr = require('rfr');
const firebaseBucket = rfr('/firebase/index');

const constant = rfr('/shared/constant');
const config = rfr('/shared/config');
const logger = rfr('/shared/logger');

const sendResponse = (res, resObj) => { res.send(resObj); }

const getSuccessResObj = () => {
  var resObj = constant['RES_OBJ'];
  return {
    code: resObj['CODE']['SUCCESS'],
    status: resObj['STATUS']['SUCCESS'],
    message: resObj['MSG']['SUCCESS']
  }
}

const getErrorResObj = () => {
  var resObj = constant['RES_OBJ'];
  return {
    code: resObj['CODE']['FAIL'],
    status: resObj['STATUS']['FAIL'],
    message: resObj['MSG']['FAIL'],
    data: {}
  }
}

const formatRequestDataForInsert = (reqBody) => {
  const columns = Object.keys(reqBody[0]);
  const valuesArr = reqBody.map( obj => columns.map( key => obj[key]));
  return { columns, valuesArr };
}

const log = (msg, value = null) => {
	if (config['showServerLog']) {
		console.log(msg, (value === null ? '' : value));
	}
}

const getStringifyObj = (obj = {}) => {
  try {
    return JSON.stringify(obj);
  } catch(ex) {
    writeErrorLog('utils', 'getStringifyObj', 'Exception while doing Stringify', ex);
    return obj;
  }
}

const writeErrorLog = (fileName, funName, msg, err, queryParam) => {
  let stringifyErr = getStringifyObj(err);
  if (queryParam) {
    logger.error(`[${fileName}] | <${funName}> - ${msg} with query ${getStringifyObj(queryParam)} --> ${stringifyErr}`);
  } else {
    logger.error(`[${fileName}] | <${funName}> - ${msg} --> ${stringifyErr}`);
  }
}

const writeInsideFunctionLog = (fileName, funName, params) => {
  if (params) {
    let strParams = getStringifyObj(params);
    logger.info(`[${fileName}] - Inside <${funName}> function with params ${strParams}`);
  } else {
    logger.info(`[${fileName}] - Inside <${funName}> function`);
  }
}

const getCurrentDate = () => Date.now();

const dateDiffInDays = (date1, date2) => {
  dt1 = new Date(date1);
  dt2 = new Date(date2);
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}

const formatAmount = amount => {
  const decimal = amount % 1;
  const quotient = Math.floor(amount / 1);
  epsilon = 0.00001;
  let result = '';
  switch (true) {
    case (Math.abs(decimal-0.75) < epsilon):
      result = '3/4 ';
      break;
    case (Math.abs(decimal-0.66) < epsilon):
    case (Math.abs(decimal-0.67) < epsilon):
      result = '2/3 ';
      break;
    case (Math.abs(decimal-0.5) < epsilon):
      result = '1/2 ';
      break;
    case (Math.abs(decimal-0.33) < epsilon):
      result = '1/3 ';
      break;
    case (Math.abs(decimal-0.25) < epsilon):
      result = '1/4 ';
      break;
    case (Math.abs(decimal-0.125) < epsilon):
      result = '1/8 ';
      break;
    case (Math.abs(decimal-0.0625) < epsilon):
      result = '1/16 ';
      break;
    case (Math.abs(decimal-0.03125) < epsilon):
      result = '1/32 ';
      break;
  }
  result  = quotient ? `${quotient} ${result}`: `${result}`;
  return result;
}

const _saleInterval = (startDay, endDay) => {
  let saleInterval = (endDay - startDay);
  if (endDay < startDay) {
    saleInterval = (7 - startDay) + endDay;
  }
  return saleInterval;
}

const _addDayInDate = (date, addDays) => {
  return new Date(date.getTime() + addDays * constant['ONE_DAY_TIMESTAMP']);
}

const _subtractDayInDate = (date, subtractDays) => {
  return new Date(date.getTime() - subtractDays * constant['ONE_DAY_TIMESTAMP']);
}

const getSaleDates = (startDay, endDay) => {
  let currentDate = new Date();
  let firstDayOfCurrentWeek = _subtractDayInDate(currentDate, currentDate.getDay());
  let firstDayOfNextWeek = _addDayInDate(firstDayOfCurrentWeek, 6);
  let currentDay = currentDate.getDay() || 7;
  const saleInterval = _saleInterval(startDay, endDay);
  let saleStartDate = currentDate;
  let saleEndDate = _addDayInDate(saleStartDate, saleInterval);
  if (currentDay === startDay) {
    saleStartDate = saleStartDate;
    saleEndDate = saleEndDate;
  } else if (currentDay === endDay) {
    saleEndDate = currentDate;
    saleStartDate = _subtractDayInDate(saleEndDate, saleInterval);
  } else if (startDay < endDay) {
    if (currentDay < endDay) {
      saleStartDate = _addDayInDate(firstDayOfCurrentWeek, startDay);
      saleEndDate = _addDayInDate(firstDayOfCurrentWeek, endDay);
    }
    else {
      saleStartDate = _addDayInDate(firstDayOfNextWeek, startDay);
      saleEndDate = _addDayInDate(firstDayOfNextWeek, endDay);
    }
  } else if (startDay > endDay) {
    if (currentDay < startDay && currentDay > endDay) {
      saleStartDate = _addDayInDate(firstDayOfCurrentWeek, startDay);
      saleEndDate = _addDayInDate(firstDayOfCurrentWeek, endDay);
    } else {
      saleEndDate = _addDayInDate(firstDayOfCurrentWeek, endDay);
      saleStartDate = _subtractDayInDate(saleEndDate, saleInterval);
    }
  }
  return {saleStartDate, saleEndDate};
}

// Function to upload file on firebase
const uploadFileOnFirebase = (file, fileType) => {
  const timestamp = Date.now();
  const originalName = file.originalname;
  const name = originalName.split(".")[0];
  const type = originalName.split(".")[1];
  const filename = `${name}_${timestamp}.${type}`;

  let validFormats = ['pdf'];
  if (fileType === 'image') {
    validFormats = ['jpg', 'jpeg', 'png'];
  }
  if (validFormats.indexOf(type) !== -1) {
    const blob = firebaseBucket.file(filename);
    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    })

    blobWriter.on('error', (err) => {
      writeErrorLog('utils', 'uploadFileOnFirebase', 'Error while uploading file on firebase', err);
      throw err;
    })

    blobWriter.on('finish', () => {
      writeInsideFunctionLog('utils', 'uploadFileOnFirebase', constant['UPLOAD_SUCCESS_MSG']);

    })

    blobWriter.end(file.buffer);
    return filename;
  } else {
    writeErrorLog('utils', 'uploadFileOnFirebase', constant['INVALID_FILE_FORMAT']);
    throw constant['INVALID_FILE_FORMAT'];
  }
}

const getSignedURLFromFirebase = async (filename) => {
// Get the signeUrl
  return await firebaseBucket.file(filename).getSignedUrl({
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60, // one hour
  })
  .then(([url]) => {
    return url;
  })
  .catch((error) => {
    throw error;
  });
}

const deleteFileInFirebase = async (filename) => {

  // Delete the file
  return await firebaseBucket.file(filename).delete()
  .then(() => {
    writeInsideFunctionLog('utils', 'uploadFileOnFirebase', constant['DELETE_SUCCESS_MSG']);
    return constant['DELETE_SUCCESS_MSG'];
  }).catch((error) => {
    writeErrorLog('utils', 'deleteFileInFirebase', error);
    return constant['OOPS_ERROR'];
  });
}

module.exports = {
	sendResponse,
	getSuccessResObj,
	getErrorResObj,
  getStringifyObj,
  formatRequestDataForInsert,
	log,
  writeErrorLog,
	writeInsideFunctionLog,
  getCurrentDate,
  dateDiffInDays,
  formatAmount,
  getSaleDates,
  uploadFileOnFirebase,
  getSignedURLFromFirebase,
  deleteFileInFirebase
}