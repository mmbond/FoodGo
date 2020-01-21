'use strict';
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

// Use express and port 8888
const app = express();
const port = 8888;

// Use cors, bodyParser json
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Listen on port 300
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));


// restaurant All GET METHOD
app.get('/api/restaurant/all', function (req, res) {
  let restaurant = require('./restaurants.json');
  res.json(restaurant);
})

// restaurant GET METHOD
app.get('/api/restaurant/id', function (req, res) {
  if (req.body) {
    let restaurant = require('./restaurants.json');
    res.json(restaurant[req.query.restaurantId - 1]);
  }
})

// meal All GET METHOD
app.get('/api/meal/all', function (req, res) {
  if (req.body) {
    let meal = require('./meals.json');
    res.json(meal[[req.query.restaurantId - 1]]);
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

// order All GET METHOD
app.get('/api/history/all', function (req, res) {
  let orders = require('./orders.json');
  res.json(orders);
})

// addresses All GET METHOD
app.get('/api/profile/getAddresses', function (req, res) {
  let addresses = require('./addresses.json');
  res.json(addresses);
})

// customer POST METHOD
app.post('/api/profile/edit', function (req, res) {
  if (req.body) {
    res.send(true);
  }
})