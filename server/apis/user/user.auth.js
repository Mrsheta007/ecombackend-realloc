
const User = require("./user.model");
const httpStatus = require('http-status');
const APIResponse = require('../../helpers/APIResponse');
const Utils = require('../../helpers/utils')
let JWTHelper = require('../../helpers/jwt.helper');
const nodemailer = require("nodemailer");
var otpGenerator = require('otp-generator')
var QuickBooks = require('node-quickbooks')
const OAuthClient = require('intuit-oauth');




async function sendmail(req, res, next) {

  var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });

  // const userId = await JWTHelper.getUser(req.headers.authorization);

  let user = await User.findOneAndUpdate(
    {
      //userID: userId, 
      email: req.body.email
    }, { $set: { "otp": otp } }
  );

  console.log("$$$$$$$$$$$$$$44", user)
  //console.log(updated);
  if (user != null) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
      }
    });

    let mailOptions = {
      from: 'mrsheta002@gmail.com',
      to: `${user.email}`,
      subject: 'Verify your mail : ecombackend',
      text: `Here is your otp to verify your email address ${otp}`
    };

    // transporter.sendMail(mailOptions, function (err, res) {
    //   if (err) {
    //     console.log("Error " + err);
    //   } else {
    //     console.log("<<<<<<<<<>>>>>>>>>>>>>>>", res.response);

    //   }
    // });

    transporter.sendMail(mailOptions).then(function (data) {
      console.log("<<<<<<<<<>>>>>>>>>>>>>>>", data);
      return res.status(httpStatus.OK)
        .json(new APIResponse({}, 'email sent', httpStatus.OK));

    }).catch(function (err) {
      return res.status(httpStatus.UNAUTHORIZED)
        .json(new APIResponse(err, 'Error in sending email', httpStatus.UNAUTHORIZED));


    })

  } else {
    return res.status(httpStatus.UNAUTHORIZED)
      .json(new APIResponse({}, 'incorrect email', httpStatus.UNAUTHORIZED));

  }

}

async function verifymail(req, res, next) {

  // const userId = await JWTHelper.getUser(req.headers.authorization);
  let user = await User.findOne(
    { //userID: userId,
      email: req.body.email
    });

  console.log("******************", user)
  let tempotp = user.otp;

  if (user = !null) {
    if (tempotp == req.body.otp) {
      let response = await User.findOneAndUpdate({ email: req.body.email }, { $set: { "verified": true, "otp": null } });
      return res.status(httpStatus.OK)
        .json(new APIResponse(response, 'User verified', httpStatus.OK));
    } else {
      return res.status(httpStatus.UNAUTHORIZED)
        .json(new APIResponse({}, 'incorrect otp', httpStatus.UNAUTHORIZED));
    }
  } else {
    console.log("enter correct email address")
  }




}

async function qb(req, res, next) {

  //Instance of client
  var oauthClient = new OAuthClient({
    clientId: 'ABRKVRhQTxizKvWzLKZkQg9DuJRqdxVD9rQhDsiEJ8f1sAjqk8',
    clientSecret: '2wBlyvBR5WtW95Zoq4sxpWeTakGWg5jWxi5ExBWH',
    environment: 'sandbox',                                // ‘sandbox’ or ‘production’
    redirectUri: 'http://localhost:8080/api/v1/user/customer'
  });

  // AuthorizationUri
  var authUri = oauthClient.authorizeUri({ scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId], state: 'testStatcafdljdklfjlkdfjkljfdlje' });
  res.redirect(authUri);





  //manual way of doing

  //   var realmId = "4620816365168379120";
  //   var consumerKey = "ABRKVRhQTxizKvWzLKZkQg9DuJRqdxVD9rQhDsiEJ8f1sAjqk8"
  //   var consumerSecret = "2wBlyvBR5WtW95Zoq4sxpWeTakGWg5jWxi5ExBWH"
  //////var oauthToken = "eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..dXwFz2Bpv94t9WBcMOSmbw.A1W5A6NoND-3tNllHpT_AkRCsJThcBKEj7xEV0AaxVdVycjajq0L3B9cLPIpQtxFbBt5I7eceaMqTUrZNWK8F-DXdeI0AcBYskJ2ZTAUN8P85rKujDAtHYKT2U1MbcIMMUiA6YRxN0bV8G0BBSP2g4jEZFrRPXQC5hwiJo4HA7q9k7aJrIot-yWEdl1rk4d5WWUc038chxf3mDLYO_zCOi4RepjdcJaQ1kkO_v9qewaXH2oiin7KLYuuR33pmXoX3f6KV6TNuixgS9chxKtT7HIwc1V91CahMPae0PJfZ23ULBzzvCJx-dZd5QM6OtRES0dzyMq-Zi7J33Nze-5l5e3xpEg3Qbc1Ru6zGeKYEhvPBt3N9vDhst4_fvt_Xg-vboBik9W2Q-7PbJBm8lpIREOcKLp08By344tyhceAynaKg7w47W0BEHUJOrAEaInutK9T2glaviL_S5JuaWrR6KO3l8GLJOgRsNA5J0ZuTX5VbYd3KfocJqA7x6HSHQA9cWVfdBdEFTuiFdOlZCnyZpU4ebZrZmFAsausxRoOxyYiqhz2nIoOFPvOrBqcMLrZTVGPxQU5meauMpPAyXO-ymtUXBBPAMxwgIMMqrKR-R7eJN5uG1BEKqzBwvFCUEfJUqBA3W-OFYjKkEYEG-bs73MQRgiNak6szvx-cZvZ-URaMWC3v3MZaGkevn8aVzxiMNOfmr1CnSz1I87niv45jpd1cfxXPW_ipuvrZ70Gj4ibxjVPHymbvlj84RLIEu16l6uGnoAPb4rVzdGw4PYhjADRiSlsB-jCl_qoCokbzGnpc_hG4GPBhrwTiabZ6FvG6wBMVQoG7I7vI3pAwDSe2w-ArQz1otjNgOYjiWXHTlBSQLW4WaiVJwI3Y8X4FEmB-XJOLSjRgCwd2s1-_5yzTQ.Utwd-nY6A2sWXjJIy7GbwA"
  //   var refreshToken = "AB11630258702jhpz0p02CjmnCMMC0ufhRfh3fZ9Kz3wXKLFC4"
  //   var qbo = new QuickBooks(
  //     consumerKey,
  //     consumerSecret,
  //     oauthToken,
  //     false, // no token secret for oAuth 2.0
  //     realmId,
  //     true, // use the sandbox?
  //     false, // enable debugging?
  //     null, // set minorversion, or null for the latest version
  //     '2.0',
  //     refreshToken //oAuth version
  //   );

  //   qbo.findCustomers({
  //   fetchAll: true
  // }, function(e, customers) {
  //   console.log(customers.QueryResponse.Customer[1])
  // })

  // qbo.findCustomers([
  //   {field: 'fetchAll', value: true},
  //   {field: 'FamilyName', value: 'S%', operator: 'LIKE'}
  // ], function(e, customers) {
  //   console.log(customers)
  // })

}


async function customer(req, res, next) {

  console.log("you are now redirected to the customers::::::::::::::::")

  // Parse the redirect URL for authCode and exchange them for tokens
  // var parseRedirect = req.url;

  // // Exchange the auth code retrieved from the **req.url** on the redirectUri
  // oauthClient.createToken(parseRedirect)
  //   .then(function (authResponse) {
  //     console.log('The Token is  ' + JSON.stringify(authResponse.getJson()));
  //   })
  //   .catch(function (e) {
  //     console.error("The error message is :" + e.originalMessage);
  //     console.error(e.intuit_tid);
  //   }); 
}


module.exports = { sendmail, verifymail, qb, customer };