const mysql = require('mysql');

export var restaurants = [];
export var restaurant = {};
export var ordersHistory = [];
export var customerData = {};
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
    password: "spartanac97+", // za drugu bazu ""
    database: "foodgo",
    port: 3306
});

// Check if object is empty.
export function isEmpty(obj) {
    return Object.entries(obj).length === 0
}

export function logoutClearCache(){
    restaurants = [];
    restaurant = {};
    currentOrder = {};
    ordersHistory = [];
    customerData = {};
    addedOrder = false;
}

// Get all restaurants. - RADI
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

// Get restaurant by id. - RADI
export function getRestaurantById(restaurantId){
    var query = `SELECT * FROM restaurants WHERE restaurantId = ${restaurantId};`;
    try {
        return database.query(query).then(function(rows) {
            restaurant = JSON.parse(JSON.stringify(rows))[0];
            var query1 = `
            SELECT meals.mealId as "mealId", meals.name as "name", meals.category as "category", meals.mealPicture as "mealPicture", meals.description as "description", meals_restaurants.price as "price"
            FROM meals INNER JOIN meals_restaurants 
            ON meals.mealId = meals_restaurants.mealId
            WHERE meals_restaurants.restaurantId = ${restaurant.restaurantId};`;
            try {
                return database.query(query1).then(function(rows) {
                    restaurant.meals = JSON.parse(JSON.stringify(rows));  
                    for(let i = 0; i < restaurant.meals.length; i++){
                        restaurant.meals[i].ingredients = [];
                        var query2 = `SELECT * FROM ingredients WHERE mealId = ${restaurant.meals[i].mealId};`;
                        try{
                            database.query(query2).then(function(rows) {
                                if(rows.length > 0) restaurant.meals[i].ingredients = JSON.parse(JSON.stringify(rows));
                            });
                        } catch (error) {
                            console.error(error);
                        } 
                    }
                }); 
            } catch (error) {
                console.error(error);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

// Get orders history for one customer. - NE RADI (DELOVI GDE JE UPIT UNUTAR PETLJE)
export function getAllOrdersHistory(customerId){
    var query = `
    SELECT * FROM orders
    WHERE customerId = ${customerId};`;
    try {
        return database.query(query).then(function(rows) {
            ordersHistory = JSON.parse(JSON.stringify(rows));
            for(var i = 0; i < ordersHistory.length; i++){
                ordersHistory[i].meals_ids = ordersHistory[i].meals_ids.split(", ");
                ordersHistory[i].meal_count = ordersHistory[i].meal_count.split(", ");
                ordersHistory[i].meal_ingredients_ids = JSON.parse(ordersHistory[i].meal_ingredients_ids);
                var query1 = `SELECT * FROM restaurants WHERE restaurantId = ${ordersHistory[i].restaurantId};`;
                try {
                    return database.query(query1).then(function(rows) {
                        ordersHistory[i].restaurant = JSON.parse(JSON.stringify(rows))[0];
                        ordersHistory[i].meals = [];

                        // for every distinct meal
                        for(var j = 0; j < ordersHistory[i].meal_count.length; j++){
                            let meal_id = parseInt(ordersHistory[i].meals_ids[j]);
                            var query2 = `SELECT * FROM meals WHERE mealId = ${meal_id};`;
                            try {
                                return database.query(query2).then(function(rows) {
                                    let meal = JSON.parse(JSON.stringify(rows))[0];

                                    // Push same meal by count in order
                                    for(var k = 0; k < parseInt(ordersHistory[i].meal_count[j]); k++){
                                        meal.ingredients = [];
                                        let mealIdKey = toString(meal.mealId);
                                        
                                        // Find all ingredients for specific meal and push in meal object
                                        if(ordersHistory[i].meal_ingredients_ids.hasOwnProperty(mealIdKey) && ordersHistory[i].meal_ingredients_ids[mealIdKey][k].length > 0){
                                            for(var x = 0; x < ordersHistory[i].meal_ingredients_ids[mealIdKey][k].length; x++){
                                                let ingredient_id = parseInt(ordersHistory[i].meal_ingredients_ids[mealIdKey][k][x]);
                                                var query3 = `SELECT * FROM ingredients WHERE ingredientId = ${ingredient_id};`;
                                                try {
                                                    return database.query(query3).then(function(rows) {
                                                        let ingredient = JSON.parse(JSON.stringify(rows))[0];
                                                        meal.ingredients.push(ingredient);
                                                    }); 
                                                } catch (error) {
                                                    console.error(error);
                                                }
                                            }
                                        }
                                        ordersHistory[i].meals.push(meal);
                                    }
                                });  
                            } catch (error) {
                                console.error(error);
                            }
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

// Insert customer after registration. - RADI
export function insertCustomer(customer){
    var query = `
    INSERT INTO customers (firstName, lastName, email, phone, addresses, password)
    VALUES ('${customer.firstName}', '${customer.lastName}', '${customer.email}', '${customer.phone}', '${customer.address}', '${customer.password}' );`;
    try {
        return database.query(query).then(function(rows) {
            console.log("Record inserted");
        });   
    } catch (error) {
        console.error(error);
    }
}

// Get customer if exists. - NE RADI (DELOVI GDE JE UPIT UNUTAR PETLJE)
export function getCustomerIfExists(customer, flag = null){
    var query = `
    SELECT * FROM customers
    WHERE email = '${customer.email}'`;
    if(flag == "login"){
        query +=  ` AND password = '${customer.password}'`;
    }
    query += `;`;
    try {
        return database.query(query).then(function(rows) {
            if(rows.length > 0){
                customerData.customer = JSON.parse(JSON.stringify(rows))[0];
                if(customerData.customer.addresses != null && customerData.customer.addresses != undefined){
                    customerData.customer.addresses = customerData.customer.addresses.split(", ");
                }
                if(customerData.customer.fav_restaurants != null && customerData.customer.fav_meals != undefined){
                    customerData.customer.fav_restaurants = customerData.customer.fav_restaurants.split(", ");
                    if(customerData.customer.fav_restaurants.length > 0){
                        customerData.customer.fav_restaurants_result = [];
                        var query1 = `SELECT * FROM restaurants WHERE name in (`;
                        for(var i = 0; i < customerData.customer.fav_restaurants.length; i++){
                            query1 += `'${customerData.customer.fav_restaurants[i]}'`;
                            if(i < customerData.customer.fav_restaurants.length - 1){
                                query1 += `, `;
                            }
                        }
                        query1 += `);`;
                        try {  
                            return database.query(query1).then(function(rows) {
                                customerData.customer.fav_restaurants_result = JSON.parse(JSON.stringify(rows));
                                if(customerData.customer.fav_meals != null && customerData.customer.fav_meals != undefined){
                                    customerData.customer.fav_meals = customerData.customer.fav_meals.split(", ");
                                    if(customerData.customer.fav_meals.length > 0){
                                        customerData.customer.fav_meals_result = [];
                                        var query2 = `SELECT * FROM meals WHERE name in (`;
                                        for(var j = 0; j < customerData.customer.fav_meals.length; j++){
                                            query2 += `'${customerData.customer.fav_meals[j]}'`;
                                            if(j < customerData.customer.fav_meals.length - 1){
                                                query2 += `, `;
                                            }
                                        }
                                        query2 += `);`;
                                        try {  
                                            return database.query(query2).then(function(rows) {
                                                customerData.customer.fav_meals_result = JSON.parse(JSON.stringify(rows));
                                                for(var k = 0; k < customerData.customer.fav_meals_result.length; k++){
                                                    customerData.customer.fav_meals_result[k].ingredients = [];
                                                    var query3 = `SELECT * FROM ingredients WHERE mealId = ${customerData.customer.fav_meals_result[k].mealId};`;
                                                    try{
                                                        return database.query(query3).then(function(rows) {
                                                            if(rows.length > 0) customerData.customer.fav_meals_result[k].ingredients = JSON.parse(JSON.stringify(rows));
                                                        });
                                                    } catch (error) {
                                                        console.error(error);
                                                    } 
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
                }         
            } 
        });       
    } catch (error) {
        console.error(error);
    }
}


// Update customer data. - RADI
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

// Add new order. - RADI
export function createOrder(startOrderData){
    startOrderData.timestamp = startOrderData.timestamp.substring(0,startOrderData.timestamp.length-4).replace("T", " ");
    let query = `
    INSERT INTO orders (customerId, restaurantId, address, price, timestamp, meals_ids, meal_ingredients_ids, comment, meal_count, notes)
    VALUES (${startOrderData.customerId}, ${startOrderData.restaurantId}, '${startOrderData.address}', ${startOrderData.price}, '${startOrderData.timestamp}',
    '${startOrderData.meals_ids}', '${startOrderData.meal_ingredients_ids}', '${startOrderData.comment}', '${startOrderData.meal_count}', '${startOrderData.notes}');`;
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

// Change order data, finish order or cancel order. - RADI
export function modifyOrderData(orderData){
    orderData.timestamp = orderData.timestamp.substring(0,orderData.timestamp.length-4).replace("T", " ");
    var query = `
    UPDATE orders 
    SET `;
    // Update current order.
    Object.keys(orderData).forEach(function(key){
        if(currentOrder[key] != orderData[key]){ // update if they are not same (both in cache and in db)
            currentOrder[key] = orderData[key];
            if(typeof orderData[key] != 'object'){
                if(typeof orderData[key] != 'number'){
                    query += `${key} = '${orderData[key]}', `;
                } else {
                    query += `${key} = ${orderData[key]}, `;
                }
            } 
        }
    });
    query = query.substring(0, query.length-2);
    query += ` WHERE customerId = ${orderData.customerId} AND restaurantId = ${orderData.restaurantId};`;
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

// Add or remove address. - RADI
export function modifyAddresses(modAddresses){
    modAddresses = modAddresses.join(', ');
    customerData.customer.addresses = modAddresses;
    var query = `
    UPDATE customers 
    SET addresses = '${modAddresses}'
    WHERE email = '${customerData.customer.email}' AND password = '${customerData.customer.password}';`;
    try {
        return database.query(query).then(function(rows) {
            console.log("Record updated");
        });   
    } catch (error) {
        console.error(error);
    }
}

// Add or remove favourite food. - RADI
export function modifyFavouriteFood(modFavMeals){
    modFavMeals = modFavMeals.join(', ');
    customerData.customer.fav_meals = modFavMeals;
    var query = `
    UPDATE customers 
    SET fav_meals = '${modFavMeals}'
    WHERE email = '${customerData.customer.email}' AND password = '${customerData.customer.password}';`;
    try {
        return database.query(query).then(function(rows) {
            console.log("Record updated");
        });   
    } catch (error) {
        console.error(error);
    }
}

// Add or remove favourite restaurants. - RADI
export function modifyFavouriteRestaurants(modFavRestaurants){
    modFavRestaurants = modFavRestaurants.join(', ');
    customerData.customer.fav_restaurants = modFavRestaurants;
    var query = `
    UPDATE customers 
    SET fav_restaurants = '${modFavRestaurants}'
    WHERE email = '${customerData.customer.email}' AND password = '${customerData.customer.password}';`;
    try {
        return database.query(query).then(function(rows) {
            console.log("Record updated");
        });   
    } catch (error) {
        console.error(error);
    }
}


