const rfr = require('rfr');
const mysql = require('mysql2/promise');
const cons = require('consolidate');

const config = rfr('/shared/config');
// utils = rfr('/shared/utils');

const dbObj = config['database'];

//let pool = mysql.createPool(`mysql://${dbObj.username}:${dbObj.password}@${dbObj.host}/${dbObj.db}?reconnect=true`);

//let pool = mysql.createPool(process.env.CLEARDB_AMBER_URL);

//let pool = mysql.createPool('mysql://be2fbda272a899:df8486ac@us-cdbr-east-06.cleardb.net/heroku_52b3caaac7494c9?reconnect=true');


let pool = mysql.createPool({
  connectionLimit: 50,
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'be2fbda272a899',
  password: 'df8486ac',
  port:3306,
   //database: 'heroku_52b3caaac7494c9',
})

//pool.on("connection", (connection)=>console.log("Connected with database"))

pool.getConnection().then((connection)=>{
  console.log("Database connection pool succeed")
}).catch((err)=>{
  console.log("ERROR", err)
})




// let pool = mysql.createConnection({
//   connectionLimit: 50,
//   host: 'us-cdbr-east-06.cleardb.net',
//   user: 'be2fbda272a899',
//   password: 'df8486ac',
//   port:3306,
//   database: 'heroku_52b3caaac7494c9',
// })


module.exports = pool;

