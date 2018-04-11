var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");
var mongoose = require("mongoose");
var logger = require("morgan");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleare

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/jobscraper_db");

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Static directory
app.use(express.static("public"));

//Routes
require("./routes/api-routes.js")(app);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});