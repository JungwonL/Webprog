var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStroage({
  destination: function(req, file, cb) {
    cb(null, 'uploads')/
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  }
})
var upload = nulter({storage: _storage})
var fs = require('fs');

var mysql = require('mysql');
var conn = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : '111111',
  database  : 'o2'
});
conn.connect();

var app = express();
app.use(bodyParser.urlencoded({extended: flase}));
app.locals.pretty = true;
