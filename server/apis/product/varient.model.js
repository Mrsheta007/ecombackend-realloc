"use strict";
const array = require("joi/lib/types/array");
const string = require("joi/lib/types/string");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;



var Variants = new Schema([{

  productId: { type: Number },
  product_id: Schema.ObjectId,
  varid: { type: String },

  //     ref: 'Product'},
  //  name:{type:String},
  colour: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, require: true }
}]
);

module.exports = mongoose.model("Varients", Variants);
