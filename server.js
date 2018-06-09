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

var bodyParser = require('body-parser');

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

mongoose.Promise = Promise;
if(process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        useMongoClient: true
    });
}
else {
    mongoose.connect("mongodb://localhost/onionnews", {
        useMongoClient: true
    });
}
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
require('./models/note.js');
require('./models/article.js');
// ---------------------------------------------------------------------------------------------------------------


// import controller
var router = require('./controllers/controller.js');
app.use('/', router);


// launch app
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Running on port: ' + port);
});