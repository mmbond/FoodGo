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

function getRestaurantById(restaurantId){
    query = "SELECT * FROM restaurants WHERE restaurantId =" + restaurantId;
    try {
        result = queryDb(query);
        return result;
    } catch (error) {
        console.log("Error:" + error);
    }
}

function getAllMeals(restaurantId){
    query = `SELECT * FROM meals 
    INNER JOIN meals_restaurants 
    ON meals.mealId = meals_restaurants.mealId
    WHERE meals_restaurants.restaurantId = ${restaurantId}`;
    try {
        result = queryDb(query);
        return result;
    } catch (error) {
        console.log("Error:" + error);
    }
}

function getAllOrdersHistory(customerId){
    query = `SELECT * FROM orders
    INNER JOIN restaurants 
    ON orders.restaurantId = restaurants.restaurantId
    WHERE customerId = ${customerId}`;
    try {
        result = queryDb(query);
        // FALI JOS DA DODA SVAKI OBROK U NARUDZBINU
        return result;
    } catch (error) {
        console.log("Error:" + error);
    }
}

