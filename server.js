// Node Dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var logger = require('morgan'); // for debugging
var request = require('request'); // for web-scraping
var cheerio = require('cheerio'); // for web-scraping


// initialize Express 
var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}))

// Static Content
app.use(express.static(process.cwd() + '/public'));

// Express-Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();    

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database Configuration with Mongoose

if(process.env.NODE_ENV == 'production'){
  mongoose.connect('mongodb://heroku_blw35pxv:9imcsk75c78dbe2312np9n9qgd@ds153700.mlab.com:53700/heroku_blw35pxv');
}
else{
  mongoose.connect('mongodb://localhost/onionscraper');
}
var db = mongoose.connection;

// Show any Mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// Once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// Notes an darticle models
var comment = require('./models/note.js');
var article = require('./models/article.js');


// Import Routes/Controller
var router = require('./controllers/controller.js');
app.use('/', router);


// Launch App
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Running on port: ' + port);
});