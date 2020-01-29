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
app.listen(port, () => console.log(`Backend app listening on port ${port}!`));


// restaurant All GET METHOD
app.get('/api/restaurant/all', function (req, res) {
  model.getAllRestaurants();
  res.json(model.restaurants);
})

// restaurant GET METHOD
app.get('/api/restaurant/id', function (req, res) {
  if (req.body) {
    if(model.isEmpty(model.restaurant) || model.restaurant.restaurantId != req.query.restaurantId){
      model.getRestaurantById(parseInt(req.query.restaurantId));
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
    model.customerData = {"customer": {}};
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
      res.send(true);
    } else {
      model.customerData = {"customer": {}};
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

// Customer edit POST METHOD
app.post('/api/profile/edit', function (req, res) {
  if (req.body) {
    if(model.updateCustomer(req.body)){
      res.json(model.customerData);
      res.send(true);
    } else {
      res.send(false);
    }
  }
})

// Customer modify addresses POST METHOD
app.post('/api/profile/modAddresses', function (req, res) {
  if (req.body) {
    if(model.modifyAddresses(req.body)){
      res.json(model.customerData);
      res.send(true);
    } else {
      res.send(false);
    }
  }
})

// Customer modify favourite food POST METHOD
app.post('/api/profile/modFavFood', function (req, res) {
  if (req.body) {
    if(model.modifyFavouriteFood(req.body)){
      res.json(model.customerData);
      res.send(true);
    } else {
      res.send(false);
    }
  }
})

// Customer modify favourite food POST METHOD
app.post('/api/profile/modFavRest', function (req, res) {
  if (req.body) {
    if(model.modifyFavouriteRestaurants(req.body)){
      res.json(model.customerData);
      res.send(true);
    } else {
      res.send(false);
    }
  }
})

// Order create POST METHOD
app.post('/api/order/send', function (req, res) {
  if (req.body) {
    if(model.createOrder(req.body)){
      res.send(true);
    } else {
      res.send(false);
    }
  }
})

// Order edit POST METHOD
app.post('/api/order/edit', function (req, res) {
  if (req.body) {
    if(model.modifyOrderData(req.body)){
      res.json(model.currentOrder);
      res.send(true);
    } else {
      res.send(false);
    }
  }
})