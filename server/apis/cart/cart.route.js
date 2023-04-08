const CartController = require('./cart.controller');
var router = require("express").Router();
const APIResponse = require('../../helpers/APIResponse');
const httpStatus = require('http-status');
const Joi = require('joi');


router.post("/cart", Cartaddvalidate, CartController.addproducttocart);
router.post("/deleteitem",deletevalidate,  CartController.deleteitem);
router.post("/decresequantity",decresevalidate,CartController.decreseitem);
router.post("/order",CartController.order);



const Cartadd = Joi.object().keys({
    name: Joi.string().required().error(new Error('name is required!')),
    //price: Joi.string().required().error(new Error('price is required!')),
    colour : Joi.string().required().error(new Error('colour is required!')),
    quantity:Joi.number().required().error(new Error('quantity is required--!')),
    size:Joi.string().required().error(new Error('size is required!')),
    //available: Joi.boolean().required().error(new Error('enter avaliblity'))

}).unknown();

function Cartaddvalidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), Cartadd, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

const deleteval = Joi.object().keys({
    name: Joi.string().required().error(new Error('name is required!')),
  
    colour : Joi.string().required().error(new Error('colour is required!')),
   
    size:Joi.string().required().error(new Error('size is required!')),
   

}).unknown();

function deletevalidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), deleteval, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}
const decrese = Joi.object().keys({
    name: Joi.string().required().error(new Error('name is required!')),
  
    colour : Joi.string().required().error(new Error('colour is required!')),
    quantity:Joi.number().required().error(new Error('quantity is required--!')),
   
    size:Joi.string().required().error(new Error('size is required!')),
   

}).unknown();

function decresevalidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), decrese, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

module.exports = router;