const mysql = require('mysql');

export var restaurants = [];
export var restaurant = {};
export var meals = [];
export var ordersHistory = [];
export var customerData = {"customer": {}};
export var currentOrder = {};
export var addedOrder = false;

class Database {
    constructor( config ) {
        this.connection = mysql.createPool(config);
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

var database = new Database({
    host: "localhost",
    user: "root",
    password: "spartanac97+",
    database: "foodgo",
    port: 3306
});

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
    var query = "SELECT * FROM restaurants;";
    try {
        return database.query(query).then(function(rows) {
            restaurants = rows;
        });
    } catch (error) {
        console.error(error);
    }
}

// Get restaurant by id.
export function getRestaurantById(restaurantId){
    var query = `SELECT * FROM restaurants WHERE restaurantId = ${restaurantId};`;
    try {
        return database.query(query).then(function(rows) {
            restaurant = rows[0];
        });
    } catch (error) {
        console.error(error);
    }
}

// Get all meals by restaurant Id.
export function getAllMeals(restaurantId){
    var query = `
    SELECT * FROM meals 
    INNER JOIN meals_restaurants 
    ON meals.mealId = meals_restaurants.mealId
    WHERE meals_restaurants.restaurantId = ${restaurantId};`;
    try {
        return database.query(query).then(function(rows) {
            meals = rows;  
            for(var i = 0; i < meals.length; i++){
                meals[i].ingredients = [];
                var query1 = `SELECT * FROM ingredients WHERE mealId = ${meals[i].mealId};`;
                return database.query(query1).then(function(rows1) {
                    if(rows1.length > 0) meals[i].ingredients = rows1;
                });
            }
        }); 
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
        return database.query(query).then(function(rows) {
            ordersHistory = rows;
            for(var i = 0; i < ordersHistory.length; i++){
                ordersHistory[i].meals_ids = splitSeparatedDataInArray(ordersHistory[i].meals_ids, ", ");
                ordersHistory[i].meal_count = splitSeparatedDataInArray(ordersHistory[i].meal_count, ", ");
                ordersHistory[i].meals = [];

                // for every distinct meal
                for(var j = 0; j < ordersHistory[i].meal_count.length; j++){
                    let meal_id = parseInt(ordersHistory[i].meals_ids[j]);
                    query = `SELECT * FROM meals WHERE mealId = ${meal_id};`;
                    try {
                        return database.query(query).then(function(rows1) {
                            let meal = rows1[0];

                            // Push same meal by count in order
                            for(var k = 1; k <= ordersHistory[i].meal_count[j]; k++){
                                meal.ingredients = [];
                                let mealIdKey = toString(meal.mealId);

                                // Find all ingredients for specific meal and push in meal object
                                for(var x = 0; x < ordersHistory[i].meals_ingredients_ids[mealIdKey][k].length; x++){
                                    let ingredient_id = parseInt(ordersHistory[i].meals_ingredients_ids[mealIdKey][k][x]);
                                    query = `SELECT * FROM ingredients WHERE ingredientId = ${ingredient_id};`;
                                    try {
                                        return database.query(query).then(function(rows2) {
                                            let ingredient = rows2[0];
                                            meal.ingredients.push(ingredient);
                                        });
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }
                                ordersHistory[i].meals.push(meal);
                            }
                        });  
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

// Insert customer after registration.
export function insertCustomer(customer){
    var query = `
    INSERT INTO customers (firstName, lastName, email, phone, addresses, password)
    VALUES ('${customer.firstName}', '${customer.lastName}', '${customer.email}', '${customer.phone}', '${customer.address}', '${customer.password}' );`;
    try {
        return database.query(query).then(function() {
            console.log("Record inserted");
        });   
    } catch (error) {
        console.error(error);
    }
}

// Get customer if exists.
export function getCustomerIfExists(customer){
    var query = `
    SELECT * FROM customers
    WHERE email = '${customer.email}' AND password = '${customer.password}';`;
    try {
        return database.query(query).then(function(rows) {
            if(rows[0]){
                customerData.customer = rows[0];
                customerData.customer.addresses = splitSeparatedDataInArray(customerData.customer.addresses, ", ");
                customerData.customer.fav_food = splitSeparatedDataInArray(customerData.customer.fav_food, ", ");
                customerData.customer.fav_restaurants = splitSeparatedDataInArray(customerData.customer.fav_restaurants, ", ");
                if(customerData.customer.fav_restaurants.length > 0){
                    customerData.customer.fav_restaurants_result = [];
                    var query1 = `SELECT * FROM restaurants WHERE name in ('`+customerData.customer.fav_restaurants[0] + `'`;
                    for(var i = 1; i < customerData.customer.fav_restaurants.length; i++){
                        query1 += `,'${customerData.customer.fav_restaurants[i]}'`
                    }
                    query1 += `);`;
                    try {  
                        return database.query(query1).then(function(rows) {
                            customerData.customer.fav_restaurants_result = rows;
                        });    
                    } catch (error) {
                        console.error(error);
                    }
                }
            } 
        });       
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
        return database.query(query).then(function() {
            console.log("Record updated");
        });   
    } catch (error) {
        console.error(error);
    }
}

// Add new order.
export function createOrder(startOrderData){
    let query = `
    INSERT INTO orders (customerId, restaurantId, address, price, timestamp, meals_ids, meal_ingredients_ids, comment, meal_count, note)
    VALUES (${startOrderData.customerId}, ${startOrderData.restaurantId}, '${startOrderData.address}', ${startOrderData.price}, '${startOrderData.timestamp}',
    '${startOrderData.meals_ids}', '${startOrderData.meal_ingredients_ids}', '${startOrderData.comment}', '${startOrderData.meal_count}', '${startOrderData.note}');`;
    try {
        return database.query(query).then(function() {
            console.log("Record inserted");
            Object.keys(startOrderData).forEach(function(key){
                currentOrder[key] = startOrderData[key];
            });
            addedOrder = true;
        });   
    } catch (error) {
        console.error(error);
        addedOrder = false;
    }
}

// Change order data, finish order or cancel order.
export function modifyOrderData(orderData){
    var query = `
    UPDATE orders 
    SET`;
    // Update current order.
    Object.keys(orderData).forEach(function(key){
        if(currentOrder[key] != orderData[key]){ // update if they are not same (both in cache and in db)
            currentOrder[key] = orderData[key];
            query += `${key} = '${orderData[key]}', `;
        }
    });
    query = query.substring(0, query.length-1);
    query += `WHERE customerId = '${currentOrder.customerId}' AND restaurantId = '${currentOrder.restaurantId}';`;
    try {
        return database.query(query).then(function() {
            console.log("Record updated");
            if(currentOrder["mark"] != orderData["mark"]){
                var query1 = `
                UPDATE restaurants 
                SET mark = (
                    SELECT AVG(mark) 
                    FROM orders 
                    WHERE restaurantId = ${currentOrder.restaurantId};
                    ) 
                WHERE restaurantId = ${currentOrder.restaurantId};`;
                return database.query(query1).then(function() {
                    console.log("Record updated");
                });
            }
        });
    } catch (error) {
        console.error(error);
    }
}

// Add or remove address.
export function modifyAddresses(modAddresses){
    customerData.customer.addresses = modAddresses;
    var query = `
    UPDATE customers 
    SET addresses = '${modAddresses}'
    WHERE email = '${customerData.customer.email}' AND password = '${customerData.customer.password}';`;
    try {
        return database.query(query).then(function() {
            console.log("Record updated");
        });   
    } catch (error) {
        console.error(error);
    }
}

// Add or remove favourite food.
export function modifyFavouriteFood(modFavFood){
    customerData.customer.fav_food = modFavFood;
    var query = `
    UPDATE customers 
    SET fav_food = '${modFavFood}'
    WHERE email = '${customerData.customer.email}' AND password = '${customerData.customer.password}';`;
    try {
        return database.query(query).then(function() {
            console.log("Record updated");
        });   
    } catch (error) {
        console.error(error);
    }
}

// Add or remove favourite restaurants.
export function modifyFavouriteRestaurants(modFavRestaurants){
    customerData.customer.fav_restaurants = modFavRestaurants;
    var query = `
    UPDATE customers 
    SET fav_restaurants = '${modFavRestaurants}'
    WHERE email = '${customerData.customer.email}' AND password = '${customerData.customer.password}';`;
    try {
        return database.query(query).then(function() {
            console.log("Record updated");
        });   
    } catch (error) {
        console.error(error);
    }
}


