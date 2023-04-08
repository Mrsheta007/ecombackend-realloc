const ProductController = require('./product.controller');
var router = require("express").Router();
const APIResponse = require('../../helpers/APIResponse');
const httpStatus = require('http-status');
const Joi = require('joi');


router.post("/productadd", productaddvalidate, ProductController.add);
router.post("/varient",   varientvalidate, ProductController.addvarient);
router.post("/like",ProductController.likeproduct);


const productadd = Joi.object().keys({
    name: Joi.string().required().error(new Error('name is required!')),
    price: Joi.string().required().error(new Error('price is required!')),

    available: Joi.boolean().required().error(new Error('enter avaliblity'))

}).unknown();

function productaddvalidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), productadd, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

const varientadd = Joi.object().keys({
    colour: Joi.string().required().error(new Error('colour is required!')),
    size: Joi.string().required().error(new Error('size is required!')),

    quantity: Joi.number().required().error(new Error('quantity in numberonly'))

}).unknown();

function varientvalidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), varientadd, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}


module.exports = router;