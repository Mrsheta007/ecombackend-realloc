const UserController = require('./user.controller');
const ProductController = require('../product/product.controller');
var router = require("express").Router();
const APIResponse = require('../../helpers/APIResponse');
const httpStatus = require('http-status');
const Joi = require('joi');
const userauth = require('./user.auth');
const LikedbyModel = require("../product/likedby.model");
const multer = require('multer');
fs = require('fs');
const imghelper = require('../../helpers/imageHelper');


router.post("/signup", signUpValidate, UserController.signUp, userauth.sendmail);


router.post("/qb", userauth.qb);
router.post("/customer", userauth.customer);
router.post("/login", loginValidate, UserController.login);
router.post("/sendmail", userauth.sendmail);
router.post("/verifymail", emailValidate, userauth.verifymail);
router.get("/", UserController.getAll);
router.post("/changeprofile",imghelper.single('picture'),UserController.changeProfile)
router.get("/:id", IDparamRequiredValidation, UserController.getById);

router.put("/",updateValidate,  UserController.update);

router.delete("/:id", IDparamRequiredValidation, UserController.delete);


// router.post('/uploadphoto', imghelper.single('picture'))



const signUpValidation = Joi.object().keys({
    email: Joi.string().required().error(new Error('email is required!')),
    firstName: Joi.string().required().error(new Error('firstName is required!')),
    lastName: Joi.string().required().error(new Error('lastName is required!')),
    //birthDate: Joi.date().required().error(new Error('birthDate is required!')),
    mobileNumber: Joi.number().required().error(new Error('mobileNumber is required!')),
    password: Joi.string().required().error(new Error('password is required!'))
}).unknown();

const loginValidation = Joi.object().keys({
    email: Joi.string().required().error(new Error('email is required!')),
    password: Joi.string().required().error(new Error('password is required!'))
}).unknown();

const updateValidation = Joi.object().keys({
    _id: Joi.string().required().error(new Error('_id is required!'))
}).unknown();

function signUpValidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), signUpValidation, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

function loginValidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), loginValidation, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

function updateValidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), updateValidation, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

function IDparamRequiredValidation(req, res, next) {
    if (req.params && req.params.hasOwnProperty('id')) {
        next();
    } else {
        return res.status(httpStatus.BAD_REQUEST)
            .json(new APIResponse(null, 'id param not found', httpStatus.BAD_REQUEST));
    }
}

const emailval = Joi.object().keys({
    email: Joi.string().required().error(new Error('email is required!')),
    otp: Joi.number().required().error(new Error('otp is required!'))
}).unknown();

function emailValidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), emailval, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

module.exports = router;