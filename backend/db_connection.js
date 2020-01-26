var mysql = require('mysql');

var connectionData = {
    host: "localhost",
    user: "root",
    password: "spartanac97+",
    database: "foodgo",
    port: 3306
  }

 export var con = mysql.createPool(connectionData);

 export function connectToDb(){
     con.getConnection(function(error) {
         if (error) throw error;
         console.log("Connected!");
         return true
     });
 }