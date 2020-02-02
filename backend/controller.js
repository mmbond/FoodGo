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
  model.getAllRestaurants().then(function() {
    res.json(model.restaurants);
  });
  ;
})

// restaurant GET METHOD
app.get('/api/restaurant/id', function (req, res) {
  if (req.body) {
    if(model.isEmpty(model.restaurant) || model.restaurant.restaurantId != req.query.restaurantId){
      model.getRestaurantById(parseInt(req.query.restaurantId)).then(function() {
        res.json(model.restaurant);
      });
    } else {
      res.json(model.restaurant);
    }
  }
})

// login POST METHOD
app.post('/api/administration/login', function (req, res) {
  if (req.body) {
    model.getCustomerIfExists(req.body, "login").then(function() {
      res.json(model.customerData);
    });
  }
})

// logout POST METHOD
app.post('/api/administration/logout', function (req, res) {
  if (req.body) {
    model.logoutClearCache().then(res.send(true));
  }
})

// register POST METHOD
app.post('/api/administration/register', function (req, res) {
  if (req.body) {
    var emailAndPass = {};
    emailAndPass.email = req.body.email;
    emailAndPass.password = req.body.password;
    model.getCustomerIfExists(emailAndPass).then(function() {
      if(model.isEmpty(model.customerData)){
        model.insertCustomer(req.body).then(function() {
          model.getCustomerIfExists(emailAndPass, "login").then(function() {
            res.json(model.customerData);
          });
        });
      } else {
        res.json({});
      }
    });
    
  }
})

// orders history All GET METHOD
app.get('/api/history/all', function (req, res) {
  if (req.body) {
    model.getAllOrdersHistory(req.query.customerId).then(function() {
      res.json(model.ordersHistory);
    });
  }
})

// Customer edit POST METHOD
app.post('/api/profile/edit', function (req, res) {
  if (req.body) {
    model.updateCustomer(req.body).then(function() {
      res.json(model.customerData);
    });
  }
})

// Customer modify addresses POST METHOD
app.post('/api/profile/modAddresses', function (req, res) {
  if (req.body) {
    model.modifyAddresses(req.body).then(function() {
      res.json(model.customerData);
    });
  }
})

// Customer modify favourite food POST METHOD
app.post('/api/profile/modFavFood', function (req, res) {
  if (req.body) {
    model.modifyFavouriteFood(req.body).then(function() {
      res.json(model.customerData);
    });
  }
})

// Customer modify favourite food POST METHOD
app.post('/api/profile/modFavRest', function (req, res) {
  if (req.body) {
    model.modifyFavouriteRestaurants(req.body).then(function() {
      res.json(model.customerData);
    });
  }
})

// Order create POST METHOD
app.post('/api/order/send', function (req, res) {
  if (req.body) {
    model.createOrder(req.body).then(function() {
      if(model.addedOrder){
        res.send(true);
      } else {
        res.send(false);
      }
    });
  }
})

// Order edit POST METHOD
app.post('/api/order/edit', function (req, res) {
  if (req.body) {
    model.modifyOrderData(req.body).then(function() {
      res.json(model.currentOrder);
    });
  }
})