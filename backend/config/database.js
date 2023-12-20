const mysql = require('mysql2');

const con = mysql.createPool({
    host : "localhost",
    user : "root",
    password : "admin",
    database: "assignment1"
});

// con.connect(err => {
//   if (err) throw err;
//   console.log('Database is connected succesfully');
// })


module.exports = con.promise();