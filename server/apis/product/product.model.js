"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//const uniqueValidator = require('mongoose-unique-validator');
var autoIncrement = require('mongoose-auto-increment');


//product schema
var ProductSchema = new Schema(
  {
    productId: {
      type: Number,
      index: true
    },

    name: { type: String, required: true, unique: true },
    price: { type: String, required: true },
    available: { type: Boolean, default: true },
    varients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Varients'
    }]


  }
);

function getSequenceNextValue(seqName) {
  var seqDoc = Schema.findAndModify({
    query: { _id: seqName },
    update: { $inc: { seqValue: 1 } },
    new: true
  });

  return seqDoc.seqValue;
}

autoIncrement.initialize(mongoose.connection);
ProductSchema.plugin(autoIncrement.plugin, { model: 'Product', field: 'productId', startAt: 1 });
//ProductSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Product", ProductSchema);
