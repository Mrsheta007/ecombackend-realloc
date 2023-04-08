const userModel = require('../user/user.model');

const stripeSeckey = process.env.STRIPE_SECRATE_KEY
const stripePubkey = process.env.STRIPE_PUBLIC_KEY
const stripe = require('stripe')(stripeSeckey);
const JWTHelper = require('../../helpers/jwt.helper');
const httpStatus = require('http-status');
const APIResponse = require('../../helpers/APIResponse');
const e = require('express');


async function createcustomer(req, res, next) {
    const userId = await JWTHelper.getUser(req.headers.authorization);


    const customer = await stripe.customers.create({
        id: `${userId}`,
        email: req.body.email,
        phone: req.body.phone,

    }, function (err, result) {
        if (err) {
            return res.status(httpStatus.OK).json(new APIResponse(err.message, 'Customer already exist', httpStatus.OK));
        } else {
            return res.status(httpStatus.OK).json(new APIResponse(result, 'New customer:', httpStatus.OK));
        }
    });
}
async function createproduct(req, res, next) {
  


    const product = await stripe.products.create({
        name: 'Gold Special',
      }, function (err, result) {
        if (err) {
            return res.status(httpStatus.OK).json(new APIResponse(err.message, 'error', httpStatus.OK));
        } else {
            return res.status(httpStatus.OK).json(new APIResponse(result, 'New customer:', httpStatus.OK));
        }
    });
}
async function createprice(req, res, next) {
    const price = await stripe.prices.create({
        unit_amount: 11100,
        currency: 'usd',
        recurring: { interval: 'year' },
        product: 'prod_Jh4CD6PkhMx1DU',
    }, function (err, result) {
        if (err) {
            return res.status(httpStatus.OK).json(new APIResponse(err.message, 'error', httpStatus.OK));
        } else {
            return res.status(httpStatus.OK).json(new APIResponse(result, 'New customer:', httpStatus.OK));
        }
    });
}
async function subscription(req, res, next) {
    const subscription = await stripe.subscriptions.create({
        customer: '6098cbc273327d2ad4014cbc',
        items: [
          {price: 'price_1J3g7mSBmPqfQRaMzfc5nNWQ'},
        ],
      }, function (err, result) {
        if (err) {
            return res.status(httpStatus.OK).json(new APIResponse(err.message, 'error', httpStatus.OK));
        } else {
            return res.status(httpStatus.OK).json(new APIResponse(result, 'New sub:', httpStatus.OK));
        }
    });
}


async function customerlist(req, res, next) {
    const customers = await stripe.customers.list({});
    console.log(customers)
    return res.status(httpStatus.OK).json(new APIResponse(customers, 'here is the list of custoemrs:', httpStatus.OK));
}

async function addcard(req, res, next) {
    const userId = await JWTHelper.getUser(req.headers.authorization);
    console.log("userid___________:", userId)
    // create card
    //stipe token consisting of card details should be passed in body not card number
    const card = await stripe.customers.createSource(
        userId,
        {
            source:

            //card token
            // req.body.token

            //card details should not be passed
            {
                name: req.body.fullname,
                number: `${req.body.cardNumber}`,
                object: "card",
                exp_month: req.body.exp_month,
                exp_year: req.body.exp_year
            }

        }
    );
    console.log("Card--------------------", card)
    return res.status(httpStatus.OK).json(new APIResponse(card, ':', httpStatus.OK));

}

async function cardlist(req, res, next) {
    const userId = await JWTHelper.getUser(req.headers.authorization);
    console.log("userid___________:", userId)

    const cards = await stripe.customers.listSources(
        userId,
        { object: 'card' }
    );

    let card = []
    let length = cards.data.length;
    console.log("length", length)
    if (length == 0) {

        return res.status(httpStatus.OK).json(new APIResponse(cards, 'You do not have any pre-added card for payment', httpStatus.OK));

    }
    else {
        for (let i = 0; i < length; i++) {
            card[i] = {
                "brand": cards.data[i].brand,
                "cardid": cards.data[i].id,
                "exp_month": cards.data[i].exp_month,
                "exp_year": cards.data[i].exp_year,
            }


            console.log(`card  no.${i}`, card[i])
        }
    }

    return res.status(httpStatus.OK).json(new APIResponse(card, 'here is the list of cards:', httpStatus.OK));

}

async function chargecustomer(req, res, next) {
    const userId = await JWTHelper.getUser(req.headers.authorization);
    console.log("userid___________:", userId)
    // charging the customer
    const charge = await stripe.charges.create({
        customer: userId,
        amount: req.body.amount,
        currency: 'inr',
        source: req.body.cardToken,


    });
    console.log("payment receipt+++++++++++", charge.receipt_url);
    console.log(charge)
    if (charge.status == "succeeded") {
        return next();
    } else {
        return res.status(httpStatus.OK).json(new APIResponse(charge.status, 'Payment faild', httpStatus.OK));
    }

}



module.exports = { createcustomer, customerlist, addcard, chargecustomer, cardlist, createprice, createproduct, subscription }
