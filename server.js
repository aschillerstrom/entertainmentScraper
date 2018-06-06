// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require for scraping
var request = require("request");
var cheerio = require("cheerio");
//require handlebars for style
var exphbs = require('express-handlebars');
//require for debugging
var logger = require('morgan'); 
//require mongoose
var mongoose = require('mongoose');

// Initialize Express
var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}))

//static content
app.use(express.static(process.cwd() + '/public'));

//express handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// database configuration with mongoose???? NEEDS WORK  IS THIS RIGHT??
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var db = mongoose.connection;

// display errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// show a success message when connected
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// imports the notes and articles models
var comment = require('./models/note.js');
var article = require('./models/article.js');
// ---------------------------------------------------------------------------------------------------------------


// import controller
var router = require('./controllers/controller.js');
app.use('/', router);


// launch app
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Running on port: ' + port);
});