var mysql = require('mysql');

export var connectionData = {
    host: "localhost",
    user: "root",
    password: "spartanac97+",
    database: "foodgo",
    port: 3306
  }

export var con = mysql.createConnection(connectionData);

export function connectToDb(){
    con.connect(function(error) {
        if (error) throw error;
        console.log("Connected!");
        return true
    });
}