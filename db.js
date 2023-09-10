require("dotenv").config({ path: "./.env" });

/* MYSQL
// const mysql = require("mysql");

// const pool = mysql.createPool({
//   host: process.env.HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PWD,
//   database: process.env.DB_NAME,
// });

// connection.connect(function (err) {
//   if (err) throw err;
// });

// module.exports = connection;
*/

// PostgreSQL
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
})

module.exports = pool;
