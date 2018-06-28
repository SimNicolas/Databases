var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_simn',
  password        : '7937',
  database        : 'cs340_simn'
});
module.exports.pool = pool;
