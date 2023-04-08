"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//const uniqueValidator = require('mongoose-unique-validator');
var autoIncrement = require('mongoose-auto-increment');


//product schema
var CartSchema = new Schema(
    {
      CartId: {
        type: Number,
        index: true
      },

    user: {  type:String},
    item: {type:Array} 
   

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
CartSchema.plugin(autoIncrement.plugin, { model: 'Cart', field: 'CartId', startAt: 1 });

module.exports = mongoose.model("Cart", CartSchema);
