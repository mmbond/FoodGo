var connecton = require('./db_connection.js');

function queryDb(query){
    try {
        if(connecton.connectToDb()){
            var queryResult = [];
            connecton.con.query(query, function (err, result, fields) {
                if (err) throw err;
                queryResult = result;
            });
            return queryResult;
        }
    } catch(error) {
        console.log("Error:" + error);
    }
}

function getAllRestaurants(){
    query = "SELECT * FROM restaurants";
    try {
        result = queryDb(query);
        return result;
    } catch (error) {
        console.log("Error:" + error);
    }
}

