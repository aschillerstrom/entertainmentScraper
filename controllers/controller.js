var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request'); 
var cheerio = require('cheerio'); 

// get the comment/note and article models
var comment = require('../models/note.js');
var article = require('../models/article.js');

// home page for site
router.get('/', function (req, res){
  res.redirect('/scrape');                      //scrapes page
});
