// module.exports = {
//   host      : '117.17.198.39',
//   user      : 'webprog',
//   password  : 'its_319',
//   database  : 'webprogramming',
//   port      : '33306'
// }

var express = require('express');
var mysql = require('mysql');
// var dbconfig = require('./config/database.js');
// var connection = mysql.createConnection(dbconfig);
var app = express();
var connection = mysql.createConnection({
  host      : '117.17.198.39',
  user      : 'webprog',
  password  : 'its_319',
  database  : 'webprogramming',
  port      : '33306'
});
connection.connect();
connection.query('SELECT * from user', function(err, rows, fields){
  if(!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.', err);
});

connection.end();
