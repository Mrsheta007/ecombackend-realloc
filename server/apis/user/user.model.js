"use strict";
const number = require("joi/lib/types/number");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const Utils = require('../../helpers/utils');




//user schema
var Schema = new Schema(
    {
        email: { type: String, required: true,unique: true,  lowercase: true },
        password: { type: String, required: true, select: false, set: Utils.encrypt },
        // role: { type: Role, default: Role.USER },
        firstName: { type: String, required: true, set: Utils.capitalize },
        lastName: { type: String, required: true, set: Utils.capitalize },
        // birthDate: { type: Date, required: true },
        mobileNumber: { type: Number,  required: true,  required: true },
        verified: { type: Boolean, default: false },
        otp: { type: Number, default: null},
        profilePicture:{type:String},
        usertype:{type: String, default:'user', enum:['user','admin'] }

        
        // location: { type: String },
        // isActive: { type: Boolean, default: true }
        // },
        // { timestamps: true }}
    }
);


//login user
Schema.statics.login = function (email, password) {
    return this.findOne({
        email: email,
        password: password,

    }).exec();
};

// //user find by id
// Schema.statics.findById = function (id) {
//     return this.findOne({ _id: id, isActive: true })
// };


//user update by id
// Schema.statics.update = function (data) {
//     return this.findOneAndUpdate({
//         _id: data._id,
//     }, {
//         $set: data
//     },
//         { new: true } // returns updated record
//     );
// };


//user delete by id
// Schema.statics.delete = function (id) {
//     return this.findOneAndUpdate({
//         _id: id,
//         isActive: { $ne: false }
//     }, {
//         $set: { isActive: false }
//     },
//         { new: true } // returns updated record
//     );
// };

module.exports = mongoose.model("User", Schema);
