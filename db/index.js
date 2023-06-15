const rfr = require('rfr');
const mysql = require('mysql2/promise');

const config = rfr('/shared/config'),
utils = rfr('/shared/utils');

const dbObj = config['database'];

//let pool = mysql.createPool(`mysql://${dbObj.username}:${dbObj.password}@${dbObj.host}/${dbObj.db}?reconnect=true`);

let pool = mysql.createPool(process.env.CLEARDB_AMBER_URL);

pool.getConnection((err, connection) => {
  if (err)
  throw err;
  utils.log('Database connected successfully');
});

module.exports = pool;

