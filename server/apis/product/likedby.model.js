"use strict";
const array = require("joi/lib/types/array");
const string = require("joi/lib/types/string");
var mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
var Schema = mongoose.Schema;


var Like = new Schema(
    {
        productId: { type: Number },
        data: { type: Array },
        product:{type:Object},
        count:{type:Number}

        
       
    }
);

module.exports = mongoose.model("Like", Like);
