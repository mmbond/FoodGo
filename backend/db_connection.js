var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "spartanac97+",
  database: "foodgo"
});

con.connect(function(error) {
  if (error) throw error;
  console.log("Connected!");
});