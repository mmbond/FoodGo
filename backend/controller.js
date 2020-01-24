'use strict';
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const model = require('./model.js');

// Use express and port 8888
const app = express();
const port = 8888;

// Use cors, bodyParser json
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Listen on port 8888
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));


// restaurant All GET METHOD
app.get('/api/restaurant/all', function (req, res) {
  model.getAllRestaurants();
  res.json(model.restaurants);
})

// restaurant GET METHOD
app.get('/api/restaurant/id', function (req, res) {
  if (req.body) {
    if(model.isEmpty(model.restaurant) || model.restaurant.restaurantId != req.query.restaurantId){
      model.getRestaurantById(req.query.restaurantId);
    }
    res.json(model.restaurant);
  }
})

// meal All GET METHOD
app.get('/api/meal/all', function (req, res) {
  if (req.body) {
    if(model.isEmpty(model.restaurant) || model.restaurant.restaurantId != req.query.restaurantId){
      model.getAllMeals(req.query.restaurantId);
    }
    res.json(model.meals);
  }
})

// login POST METHOD
app.post('/api/administration/login', function (req, res) {
    if (req.body) {
      model.getCustomerIfExists(req.body);
    }
    res.json(model.customerData);
})

// logout POST METHOD
app.post('/api/administration/logout', function (req, res) {
  console.log('pogodjen');
  if (req.body) {
    model.restaurants = [];
    model.restaurant = {};
    model.meals = [];
    model.ordersHistory = [];
    model.customerData = {};
    res.send(true);
  }
})

// register POST METHOD
app.post('/api/administration/register', function (req, res) {
  if (req.body) {
    let emailAndPass = {};
    emailAndPass.email = req.body.email;
    emailAndPass.password = req.body.password;
    model.getCustomerIfExists(emailAndPass);
    if(model.isEmpty(model.customerData)){
      model.insertCustomer(req.body);
      model.getCustomerIfExists(emailAndPass);
      res.json(model.customerData);
    } else {
      model.customerData = {};
      res.send(false);
    }
  }
})

// orders history All GET METHOD
app.get('/api/history/all', function (req, res) {
  if (req.body) {
    if(model.ordersHistory.length < 1){
      model.getAllOrdersHistory(req.query.customerId);
    }
    res.json(model.ordersHistory);
  }
})

// customer POST METHOD
app.post('/api/profile/edit', function (req, res) {
  if (req.body) {
    res.send(true);
  }
})