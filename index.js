"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var database = require("./database");
const cors = require("cors");
const path = require("path");

var app = express();

//CORS Middleware
app.use(cors({ origin: true }));

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

const imagesRoot = path.join(__dirname, "..", "uploads");
// app.use(processImage({ root: imagesRoot }));
app.use("/uploads", express.static(imagesRoot));

app.use("/uploads", express.static(process.cwd() + "/uploads"));

app.use((req, res, next) => {
  // console.log("req",req)
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server running on port", port);
});

function setupRoutes() {
  const routes = require("./routes");
  routes.setup(app);
}

setupRoutes();
module.exports = app;
