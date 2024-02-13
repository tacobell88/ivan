const mysql = require("mysql2");

console.log(process.env.port);
console.log(process.env.DB_HOST);
console.log(process.env.DB_PASS);

const con = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

module.exports = con.promise();
