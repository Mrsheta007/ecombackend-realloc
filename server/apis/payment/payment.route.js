const Payment = require('./customerconrolstripe');
var router = require("express").Router();
const APIResponse = require('../../helpers/APIResponse');
const httpStatus = require('http-status');
const Joi = require('joi');
const CartController = require('../cart/cart.controller');


router.post("/customer/insertcustomer", customerdata, Payment.createcustomer);
router.post("/customer/list",  Payment.customerlist);
router.post("/customer/checkout",  Payment.chargecustomer,CartController.order);
router.post("/customer/product",  Payment.createproduct);
router.post("/customer/price",  Payment.createprice);
router.post("/customer/subscription",  Payment.subscription);
router.post("/customer/addcard",  Payment.addcard);
router.post("/customer/cardlist",  Payment.cardlist);

const checkdata = Joi.object().keys({
    email: Joi.string().required().error(new Error('email is required!')),
    phone: Joi.string().required().error(new Error('phone is required!')),
}).unknown();

function customerdata(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), checkdata, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

const carddata = Joi.object().keys({
    token: Joi.string().required().error(new Error('token is required!')),

    // cardNumber: Joi.string().required().error(new Error('cardNumber is required!')),
    // exp_month: Joi.number().required().error(new Error('cardNumber is required!')),
    // exp_year: Joi.number().required().error(new Error('cardNumber is required!')),

}).unknown();

function validatecarddata(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), carddata, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}


module.exports = router;