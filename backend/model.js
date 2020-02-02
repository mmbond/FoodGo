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
            SELECT meals.mealId as "mealId", meals.name as "name", meals.category as "category", meals.mealPicture as "mealPicture", 
            meals.description as "description", meals_restaurants.price as "price"
            FROM meals INNER JOIN meals_restaurants 
            ON meals.mealId = meals_restaurants.mealId
            WHERE meals_restaurants.restaurantId = ${restaurant.restaurantId};`;
            try {
                return database.query(query1).then(function(rows) {
                    restaurant.meals = JSON.parse(JSON.stringify(rows));
                    var mealNames = ``;
                    for(var i = 0; i < restaurant.meals.length; i++){
                        mealNames += `'${restaurant.meals[i].name}'`;
                        if(i < restaurant.meals.length - 1){
                            mealNames += `, `;
                        }
                    }
                    var query2 =`
                    SELECT ingredients.ingredientId as "ingredientId", ingredients.name as "name", ingredients.price as "price", ingredients.mealId as "mealId"
                    FROM ingredients INNER JOIN meals ON ingredients.mealId = meals.mealId
                    WHERE meals.name in (${mealNames});`;
                    try{
                        return database.query(query2).then(function(rows) {
                            var ingredients = JSON.parse(JSON.stringify(rows));
                            for(var k = 0; k < restaurant.meals.length; k++){
                                restaurant.meals[k].ingredients = [];
                                for(var x = 0; x < ingredients.length; x++){
                                    if(restaurant.meals[k].mealId == ingredients[x].mealId){
                                        restaurant.meals[k].ingredients.push(ingredients[x]);
                                    }
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
        });
    } catch (error) {
        console.error(error);
    }
}

// Get orders history for one customer. - RADI
export function getAllOrdersHistory(customerId){
    var query = `
    SELECT * FROM orders
    WHERE customerId = ${customerId};`;
    try {
        return database.query(query).then(function(rows) {
            ordersHistory = JSON.parse(JSON.stringify(rows));
            var restaurantIds = ``;
            for(var i = 0; i < ordersHistory.length; i++){
                ordersHistory[i].meals_ids = ordersHistory[i].meals_ids.split(", ");
                ordersHistory[i].meal_count = ordersHistory[i].meal_count.split(", ");
                ordersHistory[i].meal_ingredients_ids = JSON.parse(ordersHistory[i].meal_ingredients_ids);
                restaurantIds += `${ordersHistory[i].restaurantId}`;
                if(i < ordersHistory.length - 1){
                    restaurantIds += `, `;
                }
            }
            var query1 = `SELECT * FROM restaurants WHERE restaurantId in (${restaurantIds});`;
            try {
                return database.query(query1).then(function(rows) {
                    var restaurants = JSON.parse(JSON.stringify(rows));

                    // for every order add valid restaurant
                    for(var k = 0; k < ordersHistory.length; k++){
                        ordersHistory[k].restaurant = {};
                        for(var x = 0; x < restaurants.length; x++){
                            if(ordersHistory[k].restaurantId == restaurants[x].restaurantId){
                                ordersHistory[k].restaurant = restaurants[x];
                            }
                        }
                    }

                    // Add all meals which belongs to specific order.
                    var mealIds = [];
                    for(var i = 0; i < ordersHistory.length; i++){
                        for(var j = 0; j < ordersHistory[i].meals_ids.length; j++){
                            if(!mealIds.includes(ordersHistory[i].meals_ids[j])){
                                mealIds.push(ordersHistory[i].meals_ids[j]);
                            }
                        }
                    }
                    mealIds = mealIds.join(`, `);
                    var query2 = `SELECT * FROM meals WHERE mealId in (${mealIds});`;
                    try {
                        return database.query(query2).then(function(rows) {
                            var allMeals = JSON.parse(JSON.stringify(rows));
                            for(var i = 0; i < ordersHistory.length; i++){
                                ordersHistory[i].meals = [];
                                for(var j = 0; j < allMeals.length; j++){
                                    if(ordersHistory[i].meals_ids.includes(allMeals[j].mealId.toString())){
                                        var meal_id_index = ordersHistory[i].meals_ids.indexOf(allMeals[j].mealId.toString());
                                        var meal_count = ordersHistory[i].meal_count[meal_id_index].toString();
                                        for(var k = 0; k < meal_count; k++){
                                            var meal = Object.assign({}, allMeals[j]);
                                            ordersHistory[i].meals.push(meal);
                                        }
                                    }
                                }
                            }
                            // Find all ingredients for every meal object.
                            var ingredientsIds = [];
                            for(var i = 0; i < ordersHistory.length; i++){
                                if(ordersHistory[i].meal_ingredients_ids != null){
                                    var mealKeys = Object.keys(ordersHistory[i].meal_ingredients_ids);
                                    for(var j = 0; j < mealKeys.length; j++){
                                        for(var k = 0; k < ordersHistory[i].meal_ingredients_ids[mealKeys[j]].length; k++){
                                            for(var x = 0; x < ordersHistory[i].meal_ingredients_ids[mealKeys[j]][k].length; x++){
                                                if(!ingredientsIds.includes(ordersHistory[i].meal_ingredients_ids[mealKeys[j]][k][x])){
                                                    ingredientsIds.push(ordersHistory[i].meal_ingredients_ids[mealKeys[j]][k][x]);
                                                }
                                            }
                                        }
                                    }
                                } 
                            }
                            ingredientsIds = ingredientsIds.join(`, `);
                            var query3 = `SELECT * FROM ingredients WHERE ingredientId in (${ingredientsIds});`;
                            try {
                                return database.query(query3).then(function(rows) {
                                    var allIngredients = JSON.parse(JSON.stringify(rows));
                                    for(var i = 0; i < ordersHistory.length; i++){
                                        if(ordersHistory[i].meal_ingredients_ids != null){
                                            var sameMealIndex = 0;
                                            var previousMealId = 0;
                                            for(var j = 0; j < ordersHistory[i].meals.length; j++){ 
                                                ordersHistory[i].meals[j].ingredients = [];
                                                if(ordersHistory[i].meal_ingredients_ids[ordersHistory[i].meals[j].mealId.toString()] != undefined){
                                                    if(previousMealId === ordersHistory[i].meals[j].mealId){
                                                        sameMealIndex++;
                                                    } else {
                                                        previousMealId = ordersHistory[i].meals[j].mealId;
                                                        sameMealIndex = 0;
                                                    }
                                                    var uniqueMealIngredientsIds = ordersHistory[i].meal_ingredients_ids[ordersHistory[i].meals[j].mealId.toString()][sameMealIndex];
                                                    uniqueMealIngredientsIds = uniqueMealIngredientsIds!=undefined ? uniqueMealIngredientsIds: [];
                                                    for(var k = 0; k < uniqueMealIngredientsIds.length; k++){
                                                        var ingredientObj = allIngredients.find(ingredient => ingredient.ingredientId === uniqueMealIngredientsIds[k]);
                                                        ordersHistory[i].meals[j].ingredients.push(ingredientObj);
                                                    }
                                                }
                                            }
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
                });
            } catch (error) {
                console.error(error);
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

// Get customer if exists. - RADI
export function getCustomerIfExists(customer, flag = null){
    customerData = {};
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
                                        var mealNames = ``;
                                        for(var j = 0; j < customerData.customer.fav_meals.length; j++){
                                            mealNames += `'${customerData.customer.fav_meals[j]}'`;
                                            if(j < customerData.customer.fav_meals.length - 1){
                                                mealNames += `, `;
                                            }
                                        }
                                        query2 += mealNames;
                                        query2 += `);`;
                                        try {  
                                            return database.query(query2).then(function(rows) {
                                                customerData.customer.fav_meals_result = JSON.parse(JSON.stringify(rows));
                                                var query3 =`
                                                SELECT ingredients.ingredientId as "ingredientId", ingredients.name as "name", 
                                                ingredients.price as "price", ingredients.mealId as "mealId"
                                                FROM ingredients INNER JOIN meals ON ingredients.mealId = meals.mealId
                                                WHERE meals.name in (${mealNames});`;
                                                try{
                                                    return database.query(query3).then(function(rows) {
                                                        var ingredients = JSON.parse(JSON.stringify(rows));
                                                        for(var k = 0; k < customerData.customer.fav_meals_result.length; k++){
                                                            customerData.customer.fav_meals_result[k].ingredients = [];
                                                            for(var x = 0; x < ingredients.length; x++){
                                                                if(customerData.customer.fav_meals_result[k].mealId == ingredients[x].mealId){
                                                                    customerData.customer.fav_meals_result[k].ingredients.push(ingredients[x]);
                                                                }
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
    INSERT INTO orders (customerId, restaurantId, address, price, timestamp, meals_ids, meal_ingredients_ids, meal_count, notes)
    VALUES (${startOrderData.customerId}, ${startOrderData.restaurantId}, '${startOrderData.address}', ${startOrderData.price}, '${startOrderData.timestamp}',
    '${startOrderData.meals_ids}', '${startOrderData.meal_ingredients_ids}', '${startOrderData.meal_count}', '${startOrderData.notes}');`;
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


