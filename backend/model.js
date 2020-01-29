const mysql = require('mysql');
const window = require('window');

export var restaurants = [];
export var restaurant = {};
export var meals = [];
export var ordersHistory = [];
export var customerData = {"customer": {}};
export var currentOrder = {};

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "spartanac97+",
    database: "foodgo",
    port: 3306
});

// Query function.
function queryDb(queryDb){
    var queryResult = [];
    try {
        pool.query(queryDb, function (err, rows) {
            if(err) throw err;
            window.queryResult = JSON.parse(JSON.stringify(rows));
        });
        queryResult = window.queryResult;
    } catch(error) {
        console.error(error);
    }
    return queryResult;
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
        let result = queryDb(query);
        restaurants = result;
    } catch (error) {
        console.error(error);
    }
}

// Get restaurant by id.
export function getRestaurantById(restaurantId){
    let query = `SELECT * FROM restaurants WHERE restaurantId = ${restaurantId};`;
    try {
        let result = queryDb(query);
        restaurant = result[0];
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
        let result = queryDb(query);
        result.forEach(function(meal){
            meal.ingredients = [];
            query = `SELECT * FROM ingredients WHERE mealId = ${meal.mealId};`;
            let resultIngredients = queryDb(query);
            meal.ingredients = resultIngredients;
        });
        meals = result;
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
        let result = queryDb(query);
        result.forEach(function(row){
            row.meals_ids = splitSeparatedDataInArray(row.meals_ids, ", ");
            row.meal_count = splitSeparatedDataInArray(row.meal_count, ", ");
            row.meals = [];

            // for every distinct meal
            for(let i = 0; i < row.meal_count.length; i++){
                let meal_id = parseInt(row.meals_ids[i]);
                query = `SELECT * FROM meals WHERE mealId = ${meal_id};`;
                try {
                    let result1 = queryDb(query);
                    let meal = result1[0];

                    // Push same meal by count in order
                    for(let j = 1; j <= row.meal_count[i]; j++){
                        meal.ingredients = [];
                        let mealIdKey = toString(meal.mealId);

                        // Find all ingredients for specific meal and push in meal object
                        for(let k = 0; k < row.meals_ingredients_ids[mealIdKey][j].length; k++){
                            let ingredient_id = parseInt(row.meals_ingredients_ids[mealIdKey][j][k]);
                            query = `SELECT * FROM ingredients WHERE ingredientId = ${ingredient_id};`;
                            try {
                                let result2 = queryDb(query);
                                let ingredient = result2[0];
                                meal.ingredients.push(ingredient);
                            } catch (error) {
                                console.error(error);
                            }
                        }
                        row.meals.push(meal);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        });
        ordersHistory = result;
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
        var result = queryDb(query);
        
        if(result){
            customerData.customer = result;
            customerData.customer.addresses = splitSeparatedDataInArray(result[0].addresses, ", ");
            customerData.customer.fav_food = splitSeparatedDataInArray(result[0].fav_food, ", ");
            customerData.customer.fav_restaurants = splitSeparatedDataInArray(result[0].fav_restaurants, ", ");

            if(customerData.customer.fav_restaurants.length > 0){
                customerData.customer.fav_restaurants_result = [];
                query = `SELECT * FROM restaurants WHERE name in ('`+customerData.customer.fav_restaurants[0] + `'`;
                for(var i = 1; i < customerData.customer.fav_restaurants.length; i++){
                    query += `,'${customerData.customer.fav_restaurants[i]}'`
                }
                query += `);`;
            } 
            try {  
                var result1 = queryDb(query);
                customerData.customer.fav_restaurants_result = result1;
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
        if(currentOrder[key] != orderData[key]){
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


