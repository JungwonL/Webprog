module.exports = function(){
    var express = require('express');
    var session = require('express-session');
    var MySQLStore = require('express-mysql-session')(session);
    var bodyParser = require('body-parser');

    var app = express();
    
    app.locals.pretty = true;
    app.use(express.static('public'));
    app.set('views', './views/mysql');
    app.set('view engine', 'jade');
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({
    secret: '1234DSFs@adf1234!@#$asd',
    resave: false,
    saveUninitialized: true,
    store:new MySQLStore({
        // host:'localhost',
        // user:'root',
        // password:'111111',
        // port    :3306,
        // database:'pro2'
        host      : '117.17.198.39',
        user      : 'webprog',
        password  : 'its_319',
        database  : 'webprogramming',
        port      : '33306'
    })
    }));
    return app;
}