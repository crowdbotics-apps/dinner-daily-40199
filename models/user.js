const rfr = require("rfr");
const jwtoken = require('jsonwebtoken');
const jwt = rfr("/shared/jwt");
const sgMail = require('@sendgrid/mail');
const dbQuery = rfr('/shared/query');
const constant = rfr("/shared/constant");
const config = rfr('/shared/config');
const utils = rfr("/shared/utils");
const pool = rfr("/db/index");
const helper = rfr("/shared/helper");
const bcrypt = rfr("/shared/bcrypt");


const _formatUserData = (userdata) => {
	const insertDataArr = {};
	const passwordHash = userdata.password ? bcrypt.hashPassword(userdata.password.trim()) : false;
	const name = userdata?.name;
	const username = name ? name?.split(" ")[0]:"";
	insertDataArr['name'] = name;
	insertDataArr['username'] = username;
	insertDataArr['password'] = passwordHash[0] ? passwordHash[0] : null;
	insertDataArr['created'] = helper.getDateAndTime();
	insertDataArr['salt'] = passwordHash[1] ? passwordHash[1] : null;
	insertDataArr['usernameCanonical'] = userdata.email;
	insertDataArr['emailCanonical'] = userdata.email;
	insertDataArr['email'] = userdata.email;
	insertDataArr['enabled'] = userdata.enabled ? userdata.enabled : constant["ENABLED"];
	insertDataArr['notification'] = userdata.notification ? userdata.notification : constant["ENABLED"];
	insertDataArr['allowed_number_of_menus'] = constant["NUMBER_OF_MENUS"];
	insertDataArr['google_expiration'] = 1000;
	insertDataArr['kroger_expiration'] = 1000;
	insertDataArr['roles'] = userdata.roles ? userdata.roles : constant["ROLE_USER"];
	insertDataArr['google_id'] = userdata.userid || null;
	return insertDataArr;

}

const _MandatoryFieldError = (resObj, cb)=>{
	resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
	cb(resObj);
}


const _formatSettingData = (reqBody) => {
	const settingDataObj = {
		...reqBody,
		updated: helper.getDateAndTime()
	};
	return settingDataObj;
}

/** post request for login user */
const login = async (req, res, cb) => {
	utils.writeInsideFunctionLog("user", "login", req.body);
	resObj = Object.assign({}, utils.getErrorResObj());
	const reqBody = req.body;
	if (helper.notEmpty(reqBody.email) && helper.notEmpty(reqBody.password)) {
		const email = reqBody.email.trim();
		const password = reqBody.password.trim();
		const selectQuery = dbQuery.selectQuery(constant['DB_TABLE']['USERS'], ["id", "name", "email", "password", "roles", "confirmation_token", "preferred_store_id", "notification","enabled", "created", "last_login"], { email: `'${email}'` });
		await pool.query(selectQuery).then(async ([result]) => {
			if (result && result.length) {
				let resultData = result[0];
				if (!resultData.enabled) {
					resObj['message'] = constant["USER_INACTIVE_ACCOUNT"];
					return cb(resObj);
				} else if (bcrypt.checkPassword(password, resultData.password) != true) {
					const resetDate = new Date(config['migrationDate']);
					// Check if user account was created before migration (resetDate)
					if ((new Date(resultData.created) < resetDate) && (new Date(resultData.last_login) < resetDate)) {
						return await _sendResetPasswordMail(resultData['email'], resultData['password'], 'reset'). then(resp => {
							resObj['message'] = constant['PASSWORD_EXPIRED'];
							return cb(resObj);
						}).catch(err => {
							resObj['message'] = err;
							return cb(resObj);
						});
					}
					resObj['message'] = constant["PASSWORD_ERROR"];
					cb(resObj);
				} else {
					const token = jwt.signIn(resultData.id);
					const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['USERS'], { last_login: helper.getDateAndTime(), confirmation_token: token }, { id: resultData.id });
					pool.query(updateQueryParam).then((resp) => {
						let roleStr = resultData.roles.split(",");
						resultData['token'] = token;
						resultData['dietPlan'] = !!resultData['preferred_store_id'];
						delete resultData['password'];
						if (roleStr.length === 1 && roleStr[0] === constant["ROLE_USER"]) {
							delete resultData['roles'];
						}
						delete resultData['confirmation_token'];
						delete resultData['state'];
						delete resultData['enabled'];
						resObj = Object.assign({ data: resultData }, utils.getSuccessResObj());
						resObj['message'] = constant["LOGIN_SUCCESS_MSG"];
						cb(resObj);
					}).catch((error) => {
						resObj['message'] = error.message || error;
						cb(resObj);
					});
				}
			} else {
				resObj['message'] = constant["EMAIL_NOT_EXITS"];
				cb(resObj);
			}
		}).catch((error) => {
			resObj['message'] = error.message || error;
			cb(resObj);
		})
	} else {
		resObj['message'] = constant["EMAIL_PASS_ERROR"];
		cb(resObj);
	}
}

/** post request for creating the signup user */
const signUp = async (req, res, cb) => {
	utils.writeInsideFunctionLog("user", "signUp", req.body);
	let data = req.body;
	resObj = Object.assign({}, utils.getErrorResObj());
	if (helper.notEmpty(data.email) && helper.notEmpty(data.password) && helper.notEmpty(data.name)) {
		const email = data.email.trim();
		const selectQuery = dbQuery.selectQuery(constant['DB_TABLE']['USERS'], [], { email: `'${email}'` });
		await pool.query(selectQuery).then(async (results) => {
			if (results[0] && results[0].length > 0) {
				resObj['message'] = constant["EMAIL_EXIST"];
				cb(resObj);
			} else {
				const formatInsertData = _formatUserData(data);
				const { columns, valuesArr } = utils.formatRequestDataForInsert([formatInsertData]);
				const insertQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['USERS'], columns);
				pool.query(insertQueryParam, [valuesArr]).then((results) => {
					if (results[0].insertId && results[0].insertId > 0) {
						const token = jwt.signIn(results[0].insertId);
						const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['USERS'], { confirmation_token: token, last_login: helper.getDateAndTime() }, { id: results[0].insertId });
						pool.query(updateQueryParam).then((res) => {
							let resultData = {
								id: results[0].insertId,
								...data,
								token,
								dietPlan: false,
								notification: 1,
								created: formatInsertData.created,
							};
							delete resultData['password']
							resObj = Object.assign({ data: resultData }, utils.getSuccessResObj())
							resObj['message'] = constant['SIGNUP_SUCCESS_MSG'];
							cb(resObj);
						}).catch((error) => {
							resObj['message'] = constant['OOPS_ERROR'];
							resObj['data'] = error.message || error;
							cb(resObj);
						})
					}
				}).catch((error) => {
					resObj['message'] = constant['OOPS_ERROR'];
					resObj['data'] = error.message || error;
					cb(resObj);
				})
			}
		}).catch((error) => {
			resObj['message'] = constant['OOPS_ERROR'];
			resObj['data'] = error.message || error;
			cb(resObj);
		})
	} else {
		resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
		cb(resObj);
	}
}

const _socialLoginCommon = async (data, resObj, cb) => {
	const selectQuery = dbQuery.selectQuery(constant['DB_TABLE']['USERS'], ["id", "name", "email", "preferred_store_id", "notification","enabled"], { email: `'${data.email}'` });
	await pool.query(selectQuery).then((resp) => {
		const results = resp[0];
		if (results && results.length) {
			if(results[0].enabled === 0){
				resObj['message'] = constant["USER_INACTIVE_ACCOUNT"];
				cb(resObj);
				return;
			}
			const token = jwt.signIn(results[0].id);
			const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['USERS'], { confirmation_token: token, last_login: helper.getDateAndTime() }, { id: results[0].id });
			pool.query(updateQueryParam).then((res) => {
				resObj = Object.assign({ data: { ...results[0], token, 'dietPlan': !!results[0]['preferred_store_id'] } }, utils.getSuccessResObj())
				resObj['message'] = constant['SIGNUP_SUCCESS_MSG'];
				delete resObj['data']['preferred_store_id'];
				cb(resObj);
			}).catch((error) => {
				resObj['message'] = constant['OOPS_ERROR'];
				resObj['data'] = error.message || error;
				cb(resObj);
			})
		} else {
			const formatInsertData = _formatUserData(data);
			const { columns, valuesArr } = utils.formatRequestDataForInsert([formatInsertData]);
			const insertQueryParam = dbQuery.insertQuery(constant['DB_TABLE']['USERS'], columns);
			pool.query(insertQueryParam, [valuesArr]).then((results) => {
				if (results[0] && results[0].insertId > 0) {
					const token = jwt.signIn(results[0].insertId);
					const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['USERS'], { confirmation_token: token, last_login: helper.getDateAndTime() }, { id: results[0].insertId });
					pool.query(updateQueryParam).then((res) => {
						let resultData = {
							id: results[0].insertId,
							...data,
							token,
							dietPlan: false,
							notification: 1,
							created: formatInsertData.created,
						};
						delete resultData['provider'];
						delete resultData['userid'];
						resObj = Object.assign({ data: resultData }, utils.getSuccessResObj());
						resObj['message'] = constant['SIGNUP_SUCCESS_MSG'];
						cb(resObj);
					}).catch((error) => {
						resObj['message'] = constant['OOPS_ERROR'];
						resObj['data'] = error.message || error;
						cb(resObj);
					})
				}
			}).catch((error) => {
				resObj['message'] = constant['OOPS_ERROR'];
				resObj['data'] = error.message || error;
				cb(resObj);
			})
		}
	}).catch((error) => {
		resObj['message'] = constant['OOPS_ERROR'];
		resObj['data'] = error.message || error;
		cb(resObj);
	})
}

/** post request for social login */
const socialLogin = async (req, res, cb) => {
	utils.writeInsideFunctionLog("user", "socialLogin", req.body);
	let resObj = Object.assign({}, utils.getErrorResObj());
	const data = req.body;
	if (!helper.notEmpty(data.provider)){
			resObj['message'] = constant['PROVIDER_ERROR'];
			cb(resObj);
		}
	switch (data.provider) {
		case constant['GOOGLE_ACCOUNT']:
			if (helper.notEmpty(data.name) && helper.notEmpty(data.userid) && helper.notEmpty(data.email)) {
				_socialLoginCommon(data, resObj, cb);
			} else _MandatoryFieldError(resObj, cb);
			break;
		case constant['FACEBOOK_ACCOUNT']:
			if (helper.notEmpty(data.name) && helper.notEmpty(data.userid) && helper.notEmpty(data.email)) {
				_socialLoginCommon(data, resObj, cb);
			} else _MandatoryFieldError(resObj, cb);
			break;
		case constant['APPLE_ACCOUNT']:
			if (helper.notEmpty(data.userid) && helper.notEmpty(data.email)) {
				_socialLoginCommon(data, resObj, cb);
			} else {
				resObj['message'] = !!data.userid ? constant['APPLE_ERROR'] : constant['MANDATORY_FIELD_ERROR'];
				cb(resObj);
			}
			break;
		default:
			break;
	}
}

// Function For Change Password
const changePassword = async (req, res, cb) => {
	utils.writeInsideFunctionLog("user", "changePassword", req.body);
	let resObj = Object.assign({}, utils.getErrorResObj());
	const data = req.body;
	if (helper.notEmpty(data.old_password) && helper.notEmpty(data.new_password)) {
		if (helper.notEmpty(req.userData.id)) {
			const user_id = req.userData.id;
			const password = req.userData.password;
			const oldPassword = data.old_password.trim();
			const newPassword = data.new_password.trim();
			const confirmPassword = data.confirm_password.trim();
			if (!password && !!req.userData.google_id) {
				resObj['message'] = constant['SOCIAL_CHANGE_PASS_ERROR'];
				return cb(resObj);
			}
			if (bcrypt.checkPassword(oldPassword, password) != true) {
				resObj['message'] = constant["OLD_PASSWORD"];
				cb(resObj);
			} else {
				if (confirmPassword === newPassword) {
					const passwordHash = bcrypt.hashPassword(confirmPassword)
					const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['USERS'], {
						password: passwordHash[0],
						salt: passwordHash[1],
						updated: helper.getDateAndTime(),
					}, { id: user_id });
					await pool.query(updateQueryParam).then((resp) => {
						resObj = Object.assign({}, utils.getSuccessResObj());
						resObj['message'] = constant['PASSWORD_UPDATE'];
						cb(resObj);
					}).catch((error) => {
						resObj['message'] = constant['OOPS_ERROR'];
						resObj['data'] = error.message || error;
						cb(resObj);
					})
				} else {
					resObj['message'] = constant['PASSWORD_MISMATCH'];
					cb(resObj);
				}
			}
		} else {
			resObj['code'] = constant['RES_OBJ']['CODE']['UNAUTHORIZED'];
			resObj['message'] = constant["AUTH_FAIL"];
			cb(resObj)
		}
	} else {
		resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
		cb(resObj);
	}
}

// Function for api Logout
const logout = async (req, res, cb) => {
	utils.writeInsideFunctionLog("user", "logout");
	resObj = Object.assign({}, utils.getErrorResObj());
	const user_id = req.userData.id;
	if (helper.notEmpty(user_id)) {
		const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['USERS'], { confirmation_token: null, last_login: helper.getDateAndTime() }, { id: user_id });
		await pool.query(updateQueryParam).then((resp) => {
			resObj = Object.assign({}, utils.getSuccessResObj());
			resObj['message'] = constant['LOGOUT_SUCCESS_MSG'];
			cb(resObj);
		}).catch((error) => {
			resObj['message'] = constant['OOPS_ERROR'];
			resObj['data'] = error.message || error;
			cb(resObj);
		})
	} else {
		resObj['message'] = constant["AUTH_FAIL"];
		cb(resObj)
	}

}

const _getPasswordResetMailContent = (token, from, webUrl) => {
  return `<p>Dear User,</p>
  <p>This e-mail is in response to your recent request to ${from === 'forgot' ? 'recover a forgotten' : 'reset your expired'} password. Password security features are in place to ensure the security of your profile information. To reset your password, please click the link below and follow the instructions provided.</p>
  <p>
    <a href=${config.adminURL}/auth/reset-password?secretId=${token}&web=${!!webUrl} target='_blank'>${config.adminURL}/auth/reset-password?secretId=${token}&web=${!!webUrl}</a>
  </p>
  <p>This link will remain active for the next 5 minutes.</p>
  <p>Please do not reply to this e-mail.</p>`;
}

const _sendResetPasswordMail = async (email, password, from, webUrl) => {
	const token = jwt.getTokenForForgotPassword({ email, password });
	const emailHeading = (from === 'forgot' ? constant['FORGOT_PASSWORD'] : constant['RESET_PASSWORD']);
	const msg = helper.emailMsgFormat(email, emailHeading, '', _getPasswordResetMailContent(token, from, webUrl));
	return await sgMail.send(msg).then(() => {
		return constant["EMAIL_SEND_SUCCESS"];
	}).catch((error) => {
		utils.writeErrorLog('user', '_sendResetPasswordMail', 'Error while sending reset password email to user', error);
		throw error.message || error;
	})
}

// Function For Forgot Password
const forgotPassword = async (req, res, cb) => {
	utils.writeInsideFunctionLog("user", "forgotPassword");
	resObj = Object.assign({}, utils.getErrorResObj());
	if (helper.notEmpty(req.body.email)) {
		const email = req.body.email.trim();
		const selectQuery = dbQuery.selectQuery(constant['DB_TABLE']['USERS'], [], { email: `'${email}'` });
		await pool.query(selectQuery).then(async ([resultData]) => {
			if (resultData && resultData.length > 0) {
				if (!resultData[0].enabled) {
					resObj['message'] = constant["USER_INACTIVE_ACCOUNT"];
					return cb(resObj);
				} else if (!resultData[0].password && !!resultData[0].google_id) {
					resObj['message'] = constant['SOCIAL_CHANGE_PASS_ERROR'];
					return cb(resObj);
				}
				const webUrl = !!req.url.includes('/auth');
				_sendResetPasswordMail(resultData[0]['email'], resultData[0]['password'], 'forgot', webUrl). then(resp => {
					resObj = Object.assign({}, utils.getSuccessResObj());
					resObj['message'] = resp;
					cb(resObj);
				}).catch(err => {
					resObj['message'] = err;
					cb(resObj);
				});
			} else {
				resObj['message'] = constant["EMAIL_NOT_EXITS"];
				cb(resObj);
			}
		}).catch((error) => {
			resObj['message'] = constant['OOPS_ERROR'];
			resObj['data'] = error.message || error;
			cb(resObj);
		})
	} else {
		resObj['message'] = constant["EMAIL_REQUIRED"];
		cb(resObj)
	}
}

const inviteFriend = async (req, res, cb) => {
	utils.writeInsideFunctionLog("user", "inviteFriend");
	resObj = Object.assign({}, utils.getErrorResObj());
	if (helper.notEmpty(req.body.email)) {
		const emails = req.body.email.split(",");
		const msg = helper.emailMsgFormat(emails, constant['INVITE_FRIEND'], '', 'Html Welcome Msg');
		sgMail.send(msg).then((res) => {
			resObj = Object.assign({data:res}, utils.getSuccessResObj());
			resObj['message'] = constant["INVITE_EMAIL_SEND_SUCCESS"];
			cb(resObj);
		}).catch((error) => {
			resObj['message'] = constant['OOPS_ERROR'];
			resObj['data'] = error.message || error;
			cb(resObj);
		})
	} else {
		resObj['message'] = constant["EMAIL_REQUIRED"];
		cb(resObj)
	}
}

const accountSetting = async (req, res, cb) => {
	utils.writeInsideFunctionLog("user", "accountSetting");
	resObj = Object.assign({}, utils.getErrorResObj());
	const id = req.userData.id;
	try {
		const formatSettingdata = _formatSettingData(req.body);
		const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['USERS'], formatSettingdata, { id: id });
		await pool.query(updateQueryParam).then((resp) => {
			resObj = Object.assign({ data: formatSettingdata }, utils.getSuccessResObj());
			resObj['message'] = constant['UPDATE_SUCCESS_MSG'];
			cb(resObj);
		}).catch((error) => {
			resObj['data'] = error.message || error;
			utils.writeErrorLog('user', 'accountSetting', 'Error while updating user account setting in database', error);
			cb(resObj);
		});
	} catch (err) {
		resObj['message'] = constant['OOPS_ERROR'];
		resObj['data'] = err.message || err;
		utils.writeErrorLog('user', 'accountSetting', 'Error while updating user account setting', err);
		cb(resObj);
	}
}

const supportFeedback = async (req, res, cb) => {
	utils.writeInsideFunctionLog("user", "supportFeedback");
	resObj = Object.assign({}, utils.getErrorResObj());
	if (helper.notEmpty(req.body.message)) {
		const message = req.body.message;
		const email = req.userData.email;
		const msg = helper.emailMsgFormat(config.supportEmail, constant['SUPPORT_FEEDBACK'], message, '', email);
		sgMail.send(msg).then((res) => {
			resObj = Object.assign({}, utils.getSuccessResObj());
			resObj['message'] = constant["SUPPORT_EMAIL_SEND_SUCCESS"];
			cb(resObj);
		}).catch((error) => {
			resObj['message'] = constant['OOPS_ERROR'];
			resObj['data'] = error.message || error;
			cb(resObj);
		})
	} else {
		resObj['message'] = constant["MESSAGE_REQUIRED"];
		cb(resObj)
	}
}

// Function to reset user's password using the provided token
const resetPassword = async (req, res, cb) => {
	const reqBody = req.body;
	utils.writeInsideFunctionLog('user', 'resetPassword', reqBody);
	resObj = Object.assign({}, utils.getErrorResObj());
	if (!!req.query.secretId && !!reqBody.newPassword && !!reqBody.confirmPassword) {
		jwtoken.verify(req.query.secretId, config.secret, async (err, decoded) => {
			if (err) {
				resObj['message'] = constant['INVALID_LINK'];
				return cb(resObj);
			}
			const { email, password } = decoded;
			const newPassword = reqBody.newPassword.trim();
			const confirmPassword = reqBody.confirmPassword.trim();
			if (confirmPassword === newPassword) {
				const queryParam = dbQuery.selectQuery(constant['DB_TABLE']['USERS'], [], {email: `'${email}'`});
				await pool.query(queryParam).then(async ([resultData]) => {
					if (resultData && resultData.length) {
					// check if password in token match with database password
					if (password === resultData[0].password) {
						if (bcrypt.checkPassword(resultData[0].password, newPassword) == true) {
							resObj['message'] = constant['PASSWORD_EXIST'];
							return cb(resObj);
						} else {
							const passwordHash = bcrypt.hashPassword(confirmPassword);
							const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['USERS'], {
								password: passwordHash[0],
								salt: passwordHash[1],
								updated: helper.getDateAndTime(),
							}, {email: `'${email}'`});
							await pool.query(updateQueryParam).then((resp) => {
								resObj = Object.assign({}, utils.getSuccessResObj());
								resObj['message'] = constant['PASSWORD_UPDATE'];
								cb(resObj);
							}).catch((error) => {
								resObj['message'] = constant['OOPS_ERROR'];
								resObj['data'] = error.message || error;
								cb(resObj);
							})
						}
					} else {
						resObj['message'] = constant['INVALID_LINK'];
						return cb(resObj);
						}
					} else {
						resObj['message'] = constant["EMAIL_NOT_EXITS"];
						cb(resObj);
					}
				}).catch((error) => {
					resObj['message'] = constant['OOPS_ERROR'];
					resObj['data'] = error.message || error;
					cb(resObj);
				})
			} else {
				resObj['message'] = constant['PASSWORD_MISMATCH'];
				cb(resObj);
			}
	} )
	} else {
		resObj['message'] = constant["MANDATORY_FIELD_ERROR"];
		cb(resObj)
	}
}

module.exports = {
	login,
	socialLogin,
	signUp,
	changePassword,
	logout,
	forgotPassword,
	inviteFriend,
	accountSetting,
	supportFeedback,
	resetPassword
}
