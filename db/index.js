const rfr = require('rfr');
const mysql = require('mysql2/promise');

const config = rfr('/shared/config'),
utils = rfr('/shared/utils');

const dbObj = config['database'];

let pool = mysql.createPool({
  connectionLimit: dbObj['connectionLimit'],
  host: dbObj['host'],
  user: dbObj['username'],
  password: dbObj['password'],
  database: dbObj['db'],
  maxIdle: dbObj['maxIdle'],
  idleTimeout: dbObj['idleTimeout']
});

pool.getConnection((err, connection) => {
  if (err)
  throw err;
  utils.log('Database connected successfully');
});

module.exports = pool;