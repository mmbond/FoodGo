const mysql = require('mysql');
const window = require('window');

export var restaurants = [];
export var restaurant = {};
export var meals = [];
export var ordersHistory = [];
export var customerData = {"customer": {}};
export var currentOrder = {};
var queryResult = [];

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "spartanac97+",
    database: "foodgo",
    port: 3306
});

// Query function.
function queryDb(queryDb){
    try {
        pool.query(queryDb, function (err, rows) {
            if(err) throw err;
             callbackDB(JSON.stringify(rows));
        });
    } catch(error) {
        console.error(error);
    }
}

function callbackDB(result){
    queryResult = JSON.parse(result);
}

// Check if object is empty.
export function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

// Split separated values by delimiter into array.
export function splitSeparatedDataInArray(stringWithDelimiter, delimiter){
    let resultArr = [];
    if(stringWithDelimiter == undefined || stringWithDelimiter === ""){
        return resultArr;
    } else if(stringWithDelimiter.indexOf(delimiter) != -1){
        resultArr = stringWithDelimiter.split(delimiter);
    } else {
        resultArr.push(stringWithDelimiter);
    }
    return resultArr;
}

// Get all restaurants.
export function getAllRestaurants(){
    let query = "SELECT * FROM restaurants;";
    try {
        queryDb(query);
        restaurants = queryResult;
    } catch (error) {
        console.error(error);
    }
}

// Get restaurant by id.
export function getRestaurantById(restaurantId){
    let query = `SELECT * FROM restaurants WHERE restaurantId = ${restaurantId};`;
    try {
        queryDb(query);
        restaurant = queryResult[0];
    } catch (error) {
        console.error(error);
    }
}

// Get all meals by restaurant Id.
export function getAllMeals(restaurantId){
    let query = `
    SELECT * FROM meals 
    INNER JOIN meals_restaurants 
    ON meals.mealId = meals_restaurants.mealId
    WHERE meals_restaurants.restaurantId = ${restaurantId};`;
    try {
        queryDb(query);
        meals = queryResult;  
        for(var i = 0; i < meals.length; i++){
            meals[i].ingredients = [];
            query = `SELECT * FROM ingredients WHERE mealId = ${meals[i].mealId};`;
            queryDb(query);
            if(queryResult.length > 0) meals[i].ingredients;
        }
    } catch (error) {
        console.error(error);
    }
}

// Get orders history for one customer.
export function getAllOrdersHistory(customerId){
    let query = `
    SELECT * FROM orders
    INNER JOIN restaurants 
    ON orders.restaurantId = restaurants.restaurantId
    WHERE customerId = ${customerId};`;
    try {
        queryDb(query);
        ordersHistory = queryResult;
        for(var i = 0; i < ordersHistory.length; i++){
            ordersHistory[i].meals_ids = splitSeparatedDataInArray(ordersHistory[i].meals_ids, ", ");
            ordersHistory[i].meal_count = splitSeparatedDataInArray(ordersHistory[i].meal_count, ", ");
            ordersHistory[i].meals = [];

            // for every distinct meal
            for(var j = 0; j < ordersHistory[i].meal_count.length; j++){
                let meal_id = parseInt(ordersHistory[i].meals_ids[j]);
                query = `SELECT * FROM meals WHERE mealId = ${meal_id};`;
                try {
                    queryDb(query);
                    let meal = queryResult[0];

                    // Push same meal by count in order
                    for(var k = 1; k <= ordersHistory[i].meal_count[j]; k++){
                        meal.ingredients = [];
                        let mealIdKey = toString(meal.mealId);

                        // Find all ingredients for specific meal and push in meal object
                        for(var x = 0; x < ordersHistory[i].meals_ingredients_ids[mealIdKey][k].length; x++){
                            let ingredient_id = parseInt(ordersHistory[i].meals_ingredients_ids[mealIdKey][k][x]);
                            query = `SELECT * FROM ingredients WHERE ingredientId = ${ingredient_id};`;
                            try {
                                queryDb(query);
                                let ingredient = queryResult[0];
                                meal.ingredients.push(ingredient);
                            } catch (error) {
                                console.error(error);
                            }
                        }
                        ordersHistory[i].meals.push(meal);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };
    } catch (error) {
        console.error(error);
    }
}

// Insert customer after registration.
export function insertCustomer(customer){
    let query = `
    INSERT INTO customers (firstName, lastName, email, phone, addresses, password)
    VALUES ('${customer.firstName}', '${customer.lastName}', '${customer.email}', '${customer.phone}', '${customer.address}', '${customer.password}' );`;
    try {
        console.log(query);
        queryDb(query);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Get customer if exists.
export function getCustomerIfExists(customer){
    var query = `
    SELECT * FROM customers
    WHERE email = '${customer.email}' AND password = '${customer.password}';`;
    try {
        queryDb(query);
        if(queryResult[0]){
            console.log(queryResult);
            customerData.customer = queryResult[0];
            customerData.customer.addresses = splitSeparatedDataInArray(customerData.customer.addresses, ", ");
            customerData.customer.fav_food = splitSeparatedDataInArray(customerData.customer.fav_food, ", ");
            customerData.customer.fav_restaurants = splitSeparatedDataInArray(customerData.customer.fav_restaurants, ", ");

            if(customerData.customer.fav_restaurants.length > 0){
                customerData.customer.fav_restaurants_result = [];
                query = `SELECT * FROM restaurants WHERE name in ('`+customerData.customer.fav_restaurants[0] + `'`;
                for(var i = 1; i < customerData.customer.fav_restaurants.length; i++){
                    query += `,'${customerData.customer.fav_restaurants[i]}'`
                }
                query += `);`;
            } 
            try {  
                queryDb(query);
                customerData.customer.fav_restaurants_result = queryResult;
            } catch (error) {
                console.error(error);
            }
            //customerData["customer"] = result[0];
        } 
    } catch (error) {
        console.error(error);
    }
}


// Update customer data.
export function updateCustomer(customerEdited){
    customerData.customer.firstName = customerEdited.firstName;
    customerData.customer.lastName = customerEdited.lastName;
    customerData.customer.email = customerEdited.email;
    customerData.customer.phone = customerEdited.phone;
    let query = `
    UPDATE customers 
    SET firstName = '${customerEdited.firstName}', lastName = '${customerEdited.lastName}', email = '${customerEdited.email}', phone = '${customerEdited.phone}'
    WHERE email = '${customerData.customer.email}' AND password = '${customerData.customer.password}';`;
    try {
        queryDb(query);
        console.log(result.affectedRows + " record(s) updated");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Add new order.
export function createOrder(startOrderData){
    let query = `
    INSERT INTO orders (customerId, restaurantId, address, price, timestamp, meals_ids, meal_ingredients_ids, comment, meal_count, note)
    VALUES (${startOrderData.customerId}, ${startOrderData.restaurantId}, '${startOrderData.address}', ${startOrderData.price}, '${startOrderData.timestamp}',
    '${startOrderData.meals_ids}', '${startOrderData.meal_ingredients_ids}', '${startOrderData.comment}', '${startOrderData.meal_count}', '${startOrderData.note}');`;
    try {
        queryDb(query);
        Object.keys(startOrderData).forEach(function(key){
            currentOrder[key] = startOrderData[key];
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Change order data, finish order or cancel order.
export function modifyOrderData(orderData){
    let query = `
    UPDATE orders 
    SET`;
    // Update current order.
    Object.keys(orderData).forEach(function(key){
        if(currentOrder[key] != orderData[key]){ // update if they are not same (both in cache and in db)
            currentOrder[key] = orderData[key];
            query += `${key} = '${orderData[key]}'`;
            if(key == 'mark'){
                let query1 = `
                UPDATE restaurants 
                SET mark = (
                    SELECT AVG(mark) 
                    FROM orders 
                    WHERE restaurantId = ${currentOrder.restaurantId};
                    ) 
                WHERE restaurantId = ${currentOrder.restaurantId};`;
                queryDb(query1);
                console.log(result.affectedRows + " record(s) updated");
            }
        }
    });
    query += `WHERE customerId = '${currentOrder.customerId}' AND restaurantId = '${currentOrder.restaurantId}';`;
    try {
        queryDb(query);
        console.log(result.affectedRows + " record(s) updated");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }

}

// Add or remove address.
export function modifyAddresses(modAddresses){
    customerData.customer.addresses = modAddresses;
    let query = `
    UPDATE customers 
    SET addresses = '${modAddresses}'
    WHERE email = '${customerData.customer.email}' AND password = '${customerData.customer.password}';`;
    try {
        queryDb(query);
        console.log(result.affectedRows + " record(s) updated");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Add or remove favourite food.
export function modifyFavouriteFood(modFavFood){
    customerData.customer.fav_food = modFavFood;
    let query = `
    UPDATE customers 
    SET fav_food = '${modFavFood}'
    WHERE email = '${customerData.customer.email}' AND password = '${customerData.customer.password}';`;
    try {
        queryDb(query);
        console.log(result.affectedRows + " record(s) updated");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Add or remove favourite restaurants.
export function modifyFavouriteRestaurants(modFavRestaurants){
    customerData.customer.fav_restaurants = modFavRestaurants;
    let query = `
    UPDATE customers 
    SET fav_restaurants = '${modFavRestaurants}'
    WHERE email = '${customerData.customer.email}' AND password = '${customerData.customer.password}';`;
    try {
        queryDb(query);
        console.log(result.affectedRows + " record(s) updated");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}


