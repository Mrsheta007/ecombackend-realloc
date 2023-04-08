"use strict";

var config = require("./config");


exports.setup = function (app) {
    console.log("Setting up routes.");

    // https://jwt.io/introduction/
    var jwt = require("express-jwt");

    //APIs without JWTtoken
    app.use(
        "/api/v1", function (req, res, next) {
            next();
        },
        jwt({
            secret: config.tokenSecret
            
        }).unless({
            path: [
                "/api/v1/user/signup",
                '/api/v1/user/login',
                "/api/v1/user/qb",
                "/api/v1/user/customer"
            ]
        })
    );
  

    var user = require("./server/apis/user/user.route");
    var product = require("./server/apis/product/product.route");
    var cart = require("./server/apis/cart/cart.route")
    var payment = require("./server/apis/payment/payment.route")
    app.use("/api/v1/user/", user);
    app.use("/api/v1/product/",product);
    app.use("/api/v1/cart/",cart);
   app.use("/api/v1/payment/",payment)

};

module.exports = exports;
