"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//const uniqueValidator = require('mongoose-unique-validator');
//var autoIncrement = require('mongoose-auto-increment');


//product schema
var orderschema = new Schema(
    {
      // CartId: {
      //   type: Number,
      //   index: true
      // },
    // userId:{ type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User'},
    user: {  type:String},
    item: {type:Array} 
    //  [
    //      {
    //   //productId:{type: Number},
       
    //     //  ref: 'Users' },
    //      name: {type: String, require: true},
    //     price: {type: String,require: true},
    //      colour: { type: String,require: true },
    //     size: {type:String,require: true},
    //      quantity : {type:Number,require: true}
    //      }
    //  ],  

     }
);

// function getSequenceNextValue(seqName) {
//     var seqDoc = Schema.findAndModify({
//       query: { _id: seqName },
//       update: { $inc: { seqValue: 1 } },
//       new: true
//     });
  
//     return seqDoc.seqValue;
//   }




// autoIncrement.initialize(mongoose.connection);
// CartSchema.plugin(autoIncrement.plugin, { model: 'Cart', field: 'CartId', startAt: 1 });

module.exports = mongoose.model("Order", orderschema);
