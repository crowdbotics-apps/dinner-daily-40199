const rfr = require('rfr');
const pool = rfr('/db/index');
const constant = rfr('/shared/constant');
const utils = rfr('/shared/utils');
const config = rfr('/shared/config');
const helper = rfr('/shared/helper');
const dbQuery = rfr('/shared/query');
const OneSignal = require('onesignal-node');
const cron = require('node-cron');

// With default options
const client = new OneSignal.Client(config['oneSignal']['apiId'], config['oneSignal']['apiKey']);

//global object to maintained scheduled cronjobs
const cronJobs = {};

const _formatPushNotificationData = (data, userIdArray) => {
    return {
        contents: { en: data.content },
        headings: { en: data.title },
        include_external_user_ids: userIdArray,
        send_after: helper.convertDateTimeToUTC(data.notification_date, data.notification_time),
        channel_for_external_user_ids: 'push'
    };
}

const _formatEmailNotificationData = (data, emailArray) => {
    return {
        include_email_tokens: ['garg.rimpi1@yopmail.com', 'android@yopmail.com', 'g3107283@gmail.com'],
        email_subject: data.title,
        email_body: data.content,
        channel_for_external_user_ids: 'email',
        send_after: helper.convertDateTimeToUTC(data.notification_date, data.notification_time),
    }
}

const _fetchUserList = async (userGroup, storeId) => {
    const queryParam = dbQuery.fetchUserForNotificationsQuery(userGroup, storeId);
	return await pool.query(queryParam)
    .then(([resp]) => {
        return resp;
    }).catch(err => {
        utils.writeErrorLog('notification', '_fetchUserList', 'Error while fetching user list to send notifications', err, queryParam);
        throw err;
    });
}

const _fetchNotification = async (id) => {
    const queryParam = dbQuery.selectQuery(constant['DB_TABLE']['NOTIFICATION'], ['push_notification_id', 'email_notification_id'], {id: id});
    return await pool.query(queryParam)
    .then(([resp]) => {
        if (resp.length) return resp[0];
        else throw constant['NO_RESOURCE_FOUND'];
    }).catch(err => {
        utils.writeErrorLog('notification', '_fetchNotification', 'Error while fetching one notification from database', err, queryParam);
        throw err;
    });
}

const _createNotificationInDatabase = async (data) => {
    let reqData = {
        ...data,
        notification_days_repeat: data.notification_days_repeat ? data.notification_days_repeat.join(',') : '',
        store_ids: data.store_ids.join(','),
        created: helper.getDateAndTime()
    }
    const { columns, valuesArr } = utils.formatRequestDataForInsert([reqData]);
    const queryParam = dbQuery.insertQuery(constant['DB_TABLE']['NOTIFICATION'], columns);
    return await pool.query(queryParam, [valuesArr])
    .then(([resp]) => {
        return resp['insertId'];
    }).catch(err => {
        utils.writeErrorLog('notification', '_createNotificationInDatabase', 'Error while adding notification in database', err, queryParam);
        throw err;
    });
}

const _createOneSignalNotification = async (notificationData) => {
    return await client.createNotification(notificationData).then(response => {
        if (!!response.body.id) return response.body.id;
        throw response.body.errors;

    }).catch(error => {
        utils.writeErrorLog('notification', '_createOneSignalNotification', 'Error while creating new notification at one signal', error);
        throw error;
    });
}

const _updateNotification = async (id, updateData) => {
    const queryParam = dbQuery.updateQuery(constant['DB_TABLE']['NOTIFICATION'], updateData, {id: id});
    return await pool.query(queryParam)
    .then(resp => {
        return constant['UPDATE_SUCCESS_MSG'];
    }).catch(err => {
        utils.writeErrorLog('notification', '_updateNotification', 'Error while updating one signal notification id in database', err, queryParam);
        return constant['OOPS_ERROR'];
    });
}

const _deleteNotification = async (id) => {
    const queryParam = dbQuery.deleteQuery(constant['DB_TABLE']['NOTIFICATION'], {id: id});
    return await pool.query(queryParam).then(([resp])=>{
        return constant['DELETE_SUCCESS_MSG'];
     }).catch((error)=>{
        utils.writeErrorLog('notification', '_deleteNotification', 'Error while deleting one signal notification from database', error, queryParam);
        return constant['OOPS_ERROR'];
     })
}

const _deleteCronJobAndNotification = (notificationId, cb) => {
    cronJobs[notificationId] && cronJobs[notificationId].stop();
    delete cronJobs[notificationId];
    _deleteNotification(notificationId);
    let resObj = Object.assign({}, utils.getSuccessResObj());
    resObj['message'] = constant['DELETE_SUCCESS_MSG'];
    cb(resObj);
}

const _cancelOneSignalNotification = async (notificationId) => {
    if (notificationId) {
        const notificationIds = await _fetchNotification(notificationId);
        const promiseArr = [];
        promiseArr.push(client.cancelNotification(notificationIds['push_notification_id']),
        client.cancelNotification(notificationIds['email_notification_id']));
        return await Promise.all(promiseArr).then(async (resp) => {
            return true;
        }).catch(error => {
            utils.writeErrorLog('notification', '_cancelOneSignalNotification', 'Error while canceling scheduled notification from onesignal', error);
            throw error.message || error;
        });
    } else {
        throw constant['MANDATORY_FIELD_ERROR'];
    }
}

const _scheduleNotification = async(notificationId, data, updateData = {}) => {
    const userList = await _fetchUserList(data.user_group, data.store_ids);
    const userIdArray = userList.map(({ id }) => id.toString());
    const emailArray = userList.map(({ email }) => email);
    const notificationData = _formatPushNotificationData(data, userIdArray)
    const emailNotificationData = _formatEmailNotificationData(data, emailArray);
    updateData['push_notification_id'] = await _createOneSignalNotification(notificationData);
    updateData['email_notification_id'] = await _createOneSignalNotification(emailNotificationData);
    return await _updateNotification(notificationId, updateData);
}

// Function to fetch Store list using state id
const getNotification = async (req, res, cb) => {
    utils.writeInsideFunctionLog('notification', 'getNotification');
    let resObj = Object.assign({}, utils.getErrorResObj());
    const queryParam = !!req.query.count && req.query.count == 'true' ? dbQuery.selectQuery(constant['DB_TABLE']['NOTIFICATION'], ['count(*) as total']) : dbQuery.selectQuery(constant['DB_TABLE']['NOTIFICATION']);
    await pool.query(queryParam).then(([resp]) => {
        let response = !!req.query.count && req.query.count == 'true' ? resp[0]: resp;
        resObj = Object.assign({ data: response }, utils.getSuccessResObj());
        cb(resObj);
    }).catch((error)=>{
        resObj['message'] = error?.message || constant['OOPS_ERROR'];
        resObj['data'] = error?.message || constant['OOPS_ERROR'];
        utils.writeErrorLog('notification', 'getNotificaion', 'Error while fetching Notifications form database', error);
        cb(resObj);
    })
}

// Function for add api for Notification
const addNotification = async (req, res, cb) => {
    utils.writeInsideFunctionLog("notification", "addNotification", req.body);
    let data = req.body
    resObj = Object.assign({}, utils.getErrorResObj());
    if (helper.notEmpty(data.title) && helper.notEmpty(data.content) && helper.notEmpty(data.user_group) && helper.notEmpty(data.store_ids)) {
        const insertId = await _createNotificationInDatabase(data);
        try {
            if (!!data.notification_repeat) {
                if (!data.notification_days_repeat || !data.notification_days_repeat.length) {
                    resObj['message'] = constant['NO_DAY_SELECTED'];
                    return cb(resObj);
                }
                if (helper.formatDateToDDMMYYYY() === data.notification_date) {
                    await _scheduleNotification(insertId, data);
                }
                const days = data.notification_days_repeat.sort().join(',');
                cronJobs[insertId] = cron.schedule(`0 0 * * * ${days}`, async () => {
                    data['notification_date'] = helper.formatDateToDDMMYYYY();
                    await _scheduleNotification(insertId, data);
                });
            } else {
                await _scheduleNotification(insertId, data);
            }
            resObj = Object.assign({data: {id: insertId}}, utils.getSuccessResObj());
            cb(resObj);
        } catch (error) {
            resObj['message'] = error;
            // _deleteNotification(insertId);
            cb(resObj);
        }
    } else {
        resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
        cb(resObj);
    }
}

// Function to update Notification by id
const updateNotification = async (req, res, cb) => {
    utils.writeInsideFunctionLog('notification', 'updateNotification', req.body);
    let resObj = Object.assign({}, utils.getErrorResObj());
    const reqBody = req.body;
    const notificationId = req.params.id;
    if (!!notificationId && !!reqBody.notification_date && !!reqBody.user_group && !!reqBody.store_ids) {
        try {
            await _cancelOneSignalNotification(notificationId);
            let updateData = {
                ...reqBody,
                store_ids: reqBody.store_ids.join(','),
                notification_days_repeat: reqBody.notification_days_repeat ? reqBody.notification_days_repeat.join(',') : '',
                updated: helper.getDateAndTime()
            }
            if (!!reqBody.notification_repeat) {
                if (!reqBody.notification_days_repeat || !reqBody.notification_days_repeat.length) {
                    resObj['message'] = constant['NO_DAY_SELECTED'];
                    return cb(resObj);
                }
                if (helper.formatDateToDDMMYYYY() === reqBody.notification_date) {
                    await _scheduleNotification(insertId, reqBody, updateData);
                }
                cronJobs[notificationId] && cronJobs[notificationId].stop();
                delete cronJobs[notificationId];
                const days = reqBody.notification_days_repeat.sort().join(',');
                cronJobs[notificationId] = cron.schedule(`0 0 * * ${days}`, async () => {
                    reqBody['notification_date'] = helper.formatDateToDDMMYYYY();
                    await _scheduleNotification(notificationId, reqBody, updateData);
                });
            } else {
                await _scheduleNotification(notificationId, reqBody, updateData);
            }
            resObj = Object.assign({data: updateData}, utils.getSuccessResObj());
            cb(resObj);
        } catch (error) {
            resObj['message'] = error.message || error;
            cb(resObj);
        }
    } else {
        resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
        cb(resObj);
    }
}

// Function to delete Notification by id
const deleteNotification = async (req, res, cb) => {
    utils.writeInsideFunctionLog('notification', 'deleteNotification', req.params);
    let resObj = Object.assign({}, utils.getErrorResObj());
    const notificationId = req.params.id;
    try {
        await _cancelOneSignalNotification(notificationId);
        _deleteCronJobAndNotification(notificationId, cb);
    } catch (error) {
        if (((JSON.parse(error)).error == 'Not Found')) {
            return _deleteCronJobAndNotification(notificationId, cb);
        }
        resObj['message'] = error;
        cb(resObj);
    }
}

const reshceduleNotification = async () => {
    const queryParam = dbQuery.selectQuery(constant['DB_TABLE']['NOTIFICATION'], [], {notification_repeat: constant['ENABLED']});
	return await pool.query(queryParam)
    .then(([resp]) => {
        if (resp && resp.length) {
            resp.forEach(job => {
                job['store_ids'] = job['store_ids'].split(',');
                cronJobs[job.id] = cron.schedule(`0 0 * * ${job.notification_days_repeat}`, async () => {
                    job['notification_date'] = helper.formatDateToDDMMYYYY();
                    job['notification_days_repeat'] = job['notification_days_repeat'].split(',');
                    await _scheduleNotification(job.id, job);
                });
            });
        }

    }).catch(err => {
        utils.writeErrorLog('notification', 'reshceduleNotification', 'Error while fetching repeat notification list to recreate cron at server restart', err, queryParam);
        console.log('Error while creating node cron after restart: ', err);
    });
}

module.exports = {
    getNotification,
    addNotification,
    updateNotification,
    deleteNotification,
    reshceduleNotification
}