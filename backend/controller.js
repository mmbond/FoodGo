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
  if(model.restaurants.length < 1){
    model.getAllRestaurants();
  }
  res.json(model.restaurants);
})

// restaurant GET METHOD
app.get('/api/restaurant/id', function (req, res) {
  if (req.body) {
    model.getRestaurantById(req.query.restaurantId);
    res.json(model.restaurant);
  }
})

// meal All GET METHOD
app.get('/api/meal/all', function (req, res) {
  if (req.body) {
    if(model.meals.length < 1){
      model.getAllMeals(req.query.restaurantId);
    }
    res.json(model.meals);
  }
})

// login POST METHOD
app.post('/api/administration/login', function (req, res) {
  if (req.body) {
    let loginResponse = require('./loginResponse.json');
    res.json(loginResponse);
  }
})

// logout POST METHOD
app.post('/api/administration/logout', function (req, res) {
  console.log('pogodjen');
  if (req.body) {
    res.send(true);
  }
})

// register POST METHOD
app.post('/api/administration/register', function (req, res) {
  if (req.body) {
    let loginResponse = require('./loginResponse.json');
    res.json(loginResponse);
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

// addresses All GET METHOD
app.get('/api/profile/getAddresses', function (req, res) {
  if (req.body) {
    if(model.addresses.length < 1){
      model.getAddresses(req.query.customerId);
    }
    res.json(model.addresses);
  }
})

// customer POST METHOD
app.post('/api/profile/edit', function (req, res) {
  if (req.body) {
    res.send(true);
  }
})