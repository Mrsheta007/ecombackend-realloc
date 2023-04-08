
const Product = require("../product/product.model");
const Varientmodel = require("../product/varient.model");
const Cartmodel = require("./cart.model");
const httpStatus = require('http-status');
const APIResponse = require('../../helpers/APIResponse');
const Utils = require('../../helpers/utils');
const JWTHelper = require('../../helpers/jwt.helper');
const Ordermodel = require("./user.order");
const object = require("joi/lib/types/object"); 

import ReactGA from 'react-ga';

function initializeReactGA() {
    ReactGA.initialize('G-JL92J867Q7');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }



//adds new products to the cart / if the product is already there then simply increse the quantity + diffrent varient of same product is considered diffrent item
async function addproducttocart(req, res, next) {

    const userId = await JWTHelper.getUser(req.headers.authorization);
    let product = await Product.findOne({ name: req.body.name })
    let id
    if (product) {
        id = product.productId
    }
    else {
        return res.status(httpStatus.NOT_ACCEPTABLE)
            .json(new APIResponse({}, `No product is avalible called ${req.body.name} for this item`, 406));
    }


    let varient = await Varientmodel.findOne({ productId: id, colour: req.body.colour, size: req.body.size })
    if (varient) {

        //   console.log("varient-------------------------------------", varient)
        let fvarient = varient;
        let itemvar = { name: req.body.name, price: product.price, quantity: req.body.quantity, colour: req.body.colour, size: req.body.size }
        const cartexist = await Cartmodel.findOne({ user: userId })


        if (cartexist) {

            if (req.body.quantity <= fvarient.quantity) {

                console.log('cartexist=============', cartexist.item)
                let p = cartexist.item.length
                console.log("length---------------------", p)

                let checkcon;
                let i;

                for (i = 0; i < p; i++) {

                    // console.log("colour", cartexist.item[i].colour)
                    // console.log("name", cartexist.item[i].name)
                    // console.log("size", cartexist.item[i].size)
                    checkcon = await cartexist.item[i].name == req.body.name && cartexist.item[i].colour == req.body.colour && cartexist.item[i].size == req.body.size
                    console.log(`checkcon---------------------${i}`, checkcon);
                    if (checkcon) {
                        // console.log("iiiiiiiiiiiiiiiiii", i)
                        // console.log(cartexist.item)
                        let newquan = await cartexist.item[i].quantity + req.body.quantity;
                     //   console.log("+++++++++++++++++++++++++++++++++++++++++", newquan)

                        // console.log("colour", req.body.colour)
                        // console.log("name", req.body.name)
                        // console.log("size", req.body.size)
                        let updated = await Cartmodel.updateMany({
                            "user": userId, "item": { "$elemMatch": { "name": req.body.name, "colour": req.body.colour, "size": req.body.size } }
                            // "item.name":req.body.name, "item.colour":req.body.colour, "item.size":req.body.size
                        }, {
                            $set: { "item.$.quantity": newquan }
                        })
                        console.log("Increse quantity", updated)
                        return res.status(httpStatus.OK)
                            .json(new APIResponse({}, `quantity incresed`, httpStatus.OK));
                    }
                }
                console.log("adding new item in cart-----------------------------------")
                cartexist.item.push(itemvar);
                const uppendedcart = await cartexist.save();

                return res.status(httpStatus.OK)
                    .json(new APIResponse(uppendedcart, 'here is your cart', httpStatus.OK));
            } else {
                return res.status(httpStatus.NOT_ACCEPTABLE)
                    .json(new APIResponse(fvarient.quantity, `Maximum allowed quantity is ${fvarient.quantity} for this item`, 406));
            }
        } else {
            console.log("create new cart");
            try {
                if (req.body.quantity <= fvarient.quantity) {
                    var cartmodel = new Cartmodel({
                        user: userId,
                        item: itemvar
                    });
                    const cartsaved = await cartmodel.save();
                    return res.status(httpStatus.OK)
                        .json(new APIResponse(cartsaved, 'here is your cart', httpStatus.OK));
                }
                else {
                    return res.status(httpStatus.NOT_ACCEPTABLE)
                        .json(new APIResponse(fvarient.quantity, `Maximum allowed quantity is ${fvarient.quantity} for this item`, 406));
                }
            }
            catch (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR)
                    .json(error, new APIResponse({}, 'server error', httpStatus.INTERNAL_SERVER_ERROR));
            }
        }
    } else {
        return res.status(httpStatus.NOT_ACCEPTABLE)
            .json(new APIResponse({}, `No varient is avalible with name:${req.body.name} price:${product.price} quantity:${req.body.quantity} colour:${req.body.colour}, size:${req.body.size} for this item`, 406));
    }

}


//delete the varient from the cart + diffrent varient of same product is considered diffrent product
async function deleteitem(req, res, next) {

    console.log("Delete item------------------------------------")
    const userId = await JWTHelper.getUser(req.headers.authorization);
    let updated = await Cartmodel.updateOne(
        {
            "user": userId,
        },
        {
            $pull: { "item": { "name": req.body.name, "colour": req.body.colour, "size": req.body.size } }
        }
    )
    if (updated.nModified > 0) {
        let newcart = await Cartmodel.findOne({ user: userId })
        let itemlength = newcart.item.length;
        if (itemlength == 0) {
            await Cartmodel.deleteOne({ user: userId })
        }
        return res.status(httpStatus.OK)
            .json(new APIResponse({}, 'item has been deleted', httpStatus.OK));



    } else {
        return res.status(httpStatus.NOT_ACCEPTABLE)
            .json(new APIResponse({}, `NO such item in your cart `, 406));
    }
}

//decrese the quantity of the product + if the quality is decresed to 0 then the product is deleted
async function decreseitem(req, res, next) {
    const userId = await JWTHelper.getUser(req.headers.authorization);
    let itemvar = { name: req.body.name, quantity: req.body.quantity, colour: req.body.colour, size: req.body.size }
    const cartexist = await Cartmodel.findOne({ user: userId })
    if (cartexist) {
        console.log('cartexist=============', cartexist.item)
        let p = cartexist.item.length
        console.log("length---------------------", p)

        let checkcon;
        let i;

        for (i = 0; i < p; i++) {

            console.log("colour", cartexist.item[i].colour)
            console.log("name", cartexist.item[i].name)
            console.log("size", cartexist.item[i].size)
            checkcon = await cartexist.item[i].name == req.body.name && cartexist.item[i].colour == req.body.colour && cartexist.item[i].size == req.body.size
            console.log(`checkcon---------------------${i}`, checkcon);
            if (checkcon) {
                console.log("iiiiiiiiiiiiiiiiii", i)
                //console.log(cartexist.item)
                let thisquantity = cartexist.item[i].quantity;
                if (thisquantity >= req.body.quantity) {
                    let newquan = await thisquantity - req.body.quantity;
                    console.log("+++++++++++++++++++++++++++++++++++++++++", newquan)


                    console.log("colour", req.body.colour)
                    console.log("name", req.body.name)
                    console.log("size", req.body.size)

                    if (newquan != 0) {
                        let updated = await Cartmodel.updateMany({
                            "user": userId, "item": { "$elemMatch": { "name": req.body.name, "colour": req.body.colour, "size": req.body.size } }
                            // "item.name":req.body.name, "item.colour":req.body.colour, "item.size":req.body.size
                        },
                            {
                                $set: { "item.$.quantity": newquan }
                            })
                        console.log("decresed quantity", updated)
                    }
                    else {
                        let updated = await Cartmodel.updateOne(
                            {
                                "user": userId,
                            },
                            {
                                $pull: { "item": { "name": req.body.name, "colour": req.body.colour, "size": req.body.size } }
                            }
                        )
                        console.log("item removed", updated.nModified)
                        if (updated.nModified == 1) {
                            let newcart = await Cartmodel.findOne({ user: userId })
                            let itemlength = newcart.item.length;
                            if (itemlength == 0) {
                                await Cartmodel.deleteOne({ user: userId })

                                return res.status(httpStatus.OK)
                                    .json(new APIResponse({}, 'item has been deleted', httpStatus.OK));
                            }
                        }
                    }
                    return res.status(httpStatus.OK)
                        .json(new APIResponse({}, `quantity decresed`, httpStatus.OK));
                }
                else {
                    return res.status(httpStatus.NOT_ACCEPTABLE)
                        .json(new APIResponse({}, "your cart has alredy few quantity then you are asking to decrese", 406));
                }
            }
        }
        return res.status(httpStatus.NOT_ACCEPTABLE)
            .json(new APIResponse({}, "item details seems incorrect", 406));
    } else {
        return res.status(httpStatus.NOT_ACCEPTABLE)
            .json(new APIResponse({}, `cart is missing`, 406));
    }
}

// var stripehandler = StripeCheckout.configure({
//     key: stripePubkey,
//     locale: 'auto',
//     token: function(token){

//     }
// })



//order will remove all products from the cart DB and add to order DB + it will also decrese the total quantity avalible to admin as per order
async function order(req, res, next) {



    // try {
    const userId = await JWTHelper.getUser(req.headers.authorization);
    console.log("%%%%%%%%%userID",userId)
    let cart = await Cartmodel.findOne({ user: userId })
    if (cart == null) {
        return res.status(httpStatus.NOT_FOUND)
            .json(new APIResponse({}, `cart is empty`, 404));
    }

    // console.log("heres your cart", cart)
    let length = cart.item.length
    //console.log("length--------",length)

    for (let i = 0; i < length; i++) {
        let name = cart.item[i].name
        let colour = cart.item[i].colour
        let size = cart.item[i].size
        let quantity = cart.item[i].quantity
        let product = await Product.findOne({ name: name })
        //console.log("productOOOOOOOOOOO",product)
        let productId = product.productId;
        console.log("------------------", productId)

        let varientdata = await Varientmodel.findOne({ productId: productId, colour: colour, size: size })
        let varquantity = varientdata.quantity;
        if (varquantity >= quantity) {

            //it is payment module

            // const customer = await stripe.customers.create({
            //     description: 'My First Test Customer (created for API docs)',
            //   });
            //   console.log(customer);
            //   return customer;


            //needs to change again as it should only be implemented when the payment sucess such like the order
            let newquan = await varquantity - quantity;
            let updated = await Varientmodel.updateOne({ productId: productId, colour: colour, size: size },
                { $set: { "quantity": newquan } }
            );

            console.log("quantity decresed in varient", updated)

            // let orderupdate = await Ordermodel.insertMany( Cartmodel.findOne({user:userId}));

            // console.log("orderupdate_______________________",orderupdate);



        } else {
            return res.status(httpStatus.NOT_ACCEPTABLE)
                .json(new APIResponse({}, `your cart has more quantity of ${product.name} then avalible, max avalible: ${varquantity} `, 406));

        }
        // console.log(`quantity of  ${name}` , varientdata.quantity)

    }
    let t = await Cartmodel.findOne({ user: userId })


    await Ordermodel.insertMany(t, '-_id');
    console.log("userid___________:",userId)
    await Cartmodel.deleteOne({ user: userId })
    return res.status(httpStatus.NOT_ACCEPTABLE)

        .json(new APIResponse({}, `your order is placed `, 406));

}


module.exports = { addproducttocart, deleteitem, decreseitem, order };