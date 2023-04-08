
const Product = require("./product.model");
const Varientmodel = require("./varient.model");
const httpStatus = require('http-status');
const APIResponse = require('../../helpers/APIResponse');
const Utils = require('../../helpers/utils');
const varientModel = require("./varient.model");
const LikedbyModel = require("./likedby.model");
const JWTHelper = require('../../helpers/jwt.helper');
const boolean = require("joi/lib/types/boolean");
const Usermodel = require("../user/user.model")


async function add(req, res, next) {

    // try {
    //console.log(stipekey);
    const userId = await JWTHelper.getUser(req.headers.authorization);

    let tempuser = await Usermodel.findOne({ _id: userId })
    let isadmin = tempuser.usertype
    if (isadmin == 'admin') {

        Product.create(req.body).then(function (data) {
            return res.status(httpStatus.OK)
                .json(new APIResponse(data, 'product added', httpStatus.OK));
        }).catch(function (err) {
            return res.status(httpStatus.NOT_ACCEPTABLE)
                .json(new APIResponse(err, 'You can not add same item twice', httpStatus.NOT_ACCEPTABLE));
        })
        return res.status(httpStatus.OK)
            .json(new APIResponse(response, 'product add sucessfully', httpStatus.OK));
    } else {
        return res.status(httpStatus.UNAUTHORIZED)
            .json(new APIResponse('user is not admin', httpStatus.UNAUTHORIZED));
    }

}

async function addvarient(req, res, next) {
    let colour = req.body.colour
    let size = req.body.size
    let pid = req.query.productid
    try {
        let searchedproduct = await Product.findOne({ productId: pid });
        let varexist = await varientModel.findOne({ varid: `${searchedproduct._id}${colour}${size}` })
        if (varexist == null) {
            let varmodel = new varientModel({
                product_id: searchedproduct._id,
                productId: pid,
                colour: colour,
                size: size,
                quantity: req.body.quantity,
                varid: `${searchedproduct._id}${colour}${size}`
            });
            const modell = await varmodel.save();
            //console.log(req.query.id)
            //let searchedproduct = await Product.findOne({ productId: req.query.id });
            searchedproduct.varients.push(modell._id);
            const savedproduct = await searchedproduct.save();
            //console.log(Product);
            //   let response = await varient.save()
            let response = await Product.findOne({ productId: req.query.id }).populate('varients', 'size colour quantity -_id',).lean();
          
            // let p = await response.save();
            return res.status(httpStatus.OK)
                .json(new APIResponse(modell, 'Varint add sucessfully', httpStatus.OK));
        }
        else {
            return res.status(httpStatus.NOT_ACCEPTABLE)
                .json(new APIResponse({}, 'varient already exist', httpStatus.NOT_ACCEPTABLE));
        }
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json(new APIResponse({}, 'Errorr retriving data', httpStatus.INTERNAL_SERVER_ERROR, error));
    }
}




//pass the flag true=liked false=notliked
async function likeproduct(req, res, next) {
    const userId = await JWTHelper.getUser(req.headers.authorization);
    let productId = req.body.productId
    let flag = req.body.flag

    let check = await LikedbyModel.findOne({ productId: productId })

    let datavar = { user: userId, liked: flag }
    if (check == null) {

        var like = new LikedbyModel({

            productId: productId,
            data: datavar,

        })
        const saved = await like.save();
        return res.status(httpStatus.OK)
            .json(new APIResponse(saved, 'New product added in table', httpStatus.OK));
    } else {

        let updated = await LikedbyModel.findOneAndUpdate({
            "productId": productId, "data": { "$elemMatch": { "user": userId } }

        },
            {
                $set: { "data.$.liked": flag }
            }).then(function (data) {

                return res.status(httpStatus.OK)
                    .json(new APIResponse({}, 'Flag has been changed', httpStatus.OK));

            }).catch(function (err) {
                return res.status(httpStatus.OK)
                    .json(new APIResponse(err, 'Error in adding the prefernce', httpStatus.OK));
            })

        if (updated == null) {
            check.data.push(datavar);
            const uppendedcart = await check.save();
            return res.status(httpStatus.OK)
                .json(new APIResponse(uppendedcart, 'New user prefrence added', httpStatus.OK));
        }

    }

    let p = await LikedbyModel.aggregate([{ $project: { count: { $size: "$data" } } }])
    console.log("count============", p)
}

module.exports = { addvarient, add, likeproduct };