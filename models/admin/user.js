const rfr = require("rfr");
const dbQuery = rfr('/shared/query');
const bcrypt = rfr("/shared/bcrypt");
const sgMail = require('@sendgrid/mail')
const constant = rfr("/shared/constant");
const utils = rfr("/shared/utils");
const pool = rfr("/db/index");
const helper = rfr("/shared/helper");


const  _formatUserData = (data, password, id)=>{
    const passwordHash = password ? bcrypt.hashPassword(password) : false;
     const userDataObj = {
        ...data,
        enabled: constant["ENABLED"],
        notification:constant["ENABLED"],
        username:data.name.split(" ")[0],
        allowed_number_of_menus :constant["NUMBER_OF_MENUS"],
        google_expiration : 1000,
        kroger_expiration : 1000
     }
     if(id){
        userDataObj.updated = helper.getDateAndTime();
     }else {
        userDataObj.created = helper.getDateAndTime();
     }
     if(passwordHash){
        userDataObj.password=passwordHash[0];
        userDataObj.salt=passwordHash[1];
     }
     return userDataObj
} 

const _whereCondition = (queryParams)=>{
    let whereCondition = {}
    if(queryParams.role){
        whereCondition['roles'] = `'${queryParams.role}'`;
    }else{
        whereCondition['roles !'] = `'${constant["ROLE_USER"]}'`
    }
    if(queryParams.search){
        whereCondition['name']= `'${queryParams.search}'`;
    }
    return whereCondition
}

const addUser =  async (req, res, cb)=>{
    utils.writeInsideFunctionLog("Admin user", "addUser", req.body);
	let data = req.body;
	resObj = Object.assign({}, utils.getErrorResObj());
    if(helper.notEmpty(data.name) && helper.notEmpty(data.email) && helper.notEmpty(data.phone_number)&& helper.notEmpty(data.roles)){
        const email = data.email.trim();
		const selectQuery = dbQuery.selectQuery(constant['DB_TABLE']['USERS'], [], { email: `'${email}'` });
		await pool.query(selectQuery).then(async (results) => {
			if (results[0] && results[0].length) {
				resObj['message'] = constant["INTERNAL_USER_ERROR"];
				cb(resObj);
			} else {
                const password = helper.generatePassword(8);
                const msg = helper.emailMsgFormat(email, constant['INTERNAL_USER_PASSWORD'], `Your login passowrd is : ${password}`, '');
                const userData = _formatUserData(data, password);
                const { columns, valuesArr } = utils.formatRequestDataForInsert([userData]);
				const insertQuery = dbQuery.insertQuery(constant['DB_TABLE']['USERS'], columns);
                pool.query(insertQuery, [valuesArr]).then((results) => {
					if (results[0].insertId && results[0].insertId) {
                        sgMail.send(msg).then((response) => {
							resObj = Object.assign({ data: { ...data, id: results[0].insertId} }, utils.getSuccessResObj())
							resObj['message'] = constant['INTERNAL_USER_SUCCESS'];
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
        })
    }else{
        resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
		cb(resObj);
    }
}


// Function for api user List 
const userList = async (req, res, cb) => {
	utils.writeInsideFunctionLog("session", "userList");
	resObj = Object.assign({}, utils.getErrorResObj());
    const whereCondition = _whereCondition(req.query);
    const paginationObj = helper.getPagination(req.query?.page, req.query?.pageSize,req.query?.sortField,req.query?.sortValue);
	const userListQuery = dbQuery.selectQuery(constant['DB_TABLE']['USERS'],["id","name","phone_number","email","roles"], whereCondition, paginationObj);
	await pool.query(userListQuery).then((results) => {
		resObj = Object.assign({ data: results[0] }, utils.getSuccessResObj());
		cb(resObj);
	}).catch((error) => {
		resObj['message'] = constant['OOPS_ERROR'];
		resObj['data'] = error.message || error;
		cb(resObj);
	})
}

const updateUser = async (req, res, cb )=>{
	let data = req.body;
    utils.writeInsideFunctionLog("admin User", "Update User", data);
    let id = req.params.id;
    resObj = Object.assign({}, utils.getErrorResObj());
    if(helper.notEmpty(data.name) && helper.notEmpty(data.email) && helper.notEmpty(data.phone_number)&& helper.notEmpty(data.roles)){
     const formatData = _formatUserData(data, false, id);
     const updateQueryParam = dbQuery.updateQuery(constant['DB_TABLE']['USERS'], formatData, {id:id});
      await pool.query(updateQueryParam).then((resp)=>{
        resObj = Object.assign({data:data}, utils.getSuccessResObj());
        resObj['message'] = constant['UPDATE_SUCCESS_MSG'];
        cb(resObj);
     }).catch((error)=>{
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = error.message || error;
        cb(resObj);
     })
    }else{
        resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
		cb(resObj);
    }
}

// Function for Delete api for admin web user
const deleteUser = async (req, res, cb)=>{
    utils.writeInsideFunctionLog("Admin User", "Delete User");
    let id = req.params.id;
    resObj = Object.assign({}, utils.getErrorResObj());
    if(helper.notEmpty(id)){
     const queryParam = dbQuery.deleteQuery(constant['DB_TABLE']['USERS'], {id:id});
     await pool.query(queryParam).then((resp)=>{
        resObj = Object.assign({}, utils.getSuccessResObj());
        resObj['message'] = constant['DELETE_SUCCESS_MSG'];
        cb(resObj);
     }).catch((error)=>{
        resObj['message'] = constant['OOPS_ERROR'];
        resObj['data'] = error.message || error;
        cb(resObj);
     })
    }else{
        resObj['message'] = constant['MANDATORY_FIELD_ERROR'];
		cb(resObj);
    }
}

const dashBoardData = async (req, res, cb)=>{
    utils.writeInsideFunctionLog("session", "userList");
	resObj = Object.assign({}, utils.getErrorResObj());
	const dashboardQuery = dbQuery.adminDashBoardQuery(constant['DB_TABLE']['USERS']);
	await pool.query(dashboardQuery).then((results) => {
        resObj = Object.assign({ data: results[0] }, utils.getSuccessResObj());
		cb(resObj);
	}).catch((error) => {
		resObj['message'] = constant['OOPS_ERROR'];
		resObj['data'] = error.message || error;
		cb(resObj);
	})
}

module.exports = {
       addUser,
       userList,
       updateUser,
       deleteUser,
       dashBoardData,
}