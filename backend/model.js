var connecton = require('./db_connection.js');

export var restaurants = [];
export var restaurant = {};
export var meals = [];
export var ordersHistory = [];
export var addresses = [];


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

export function getAllRestaurants(){
    query = "SELECT * FROM restaurants";
    try {
        result = queryDb(query);
        restaurants = result;
    } catch (error) {
        console.log("Error:" + error);
    }
}

export function getRestaurantById(restaurantId){
    query = `SELECT * FROM restaurants WHERE restaurantId = ${restaurantId}`;
    try {
        result = queryDb(query);
        restaurant = result[0];
    } catch (error) {
        console.log("Error:" + error);
    }
}

export function getAllMeals(restaurantId){
    query = `SELECT * FROM meals 
    INNER JOIN meals_restaurants 
    ON meals.mealId = meals_restaurants.mealId
    WHERE meals_restaurants.restaurantId = ${restaurantId}`;
    try {
        result = queryDb(query);
        meals = result;
    } catch (error) {
        console.log("Error:" + error);
    }
}

export function getAllOrdersHistory(customerId){
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

export function getAddresses(customerId){
    query = `SELECT addresses FROM customers WHERE customerId = ${customerId}`;
    try {
        result = queryDb(query);
        addresses = result[0].split(",");
    } catch (error) {
        console.log("Error:" + error);
    }
}

