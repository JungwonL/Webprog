module.exports=function(){
    var mysql = require('mysql');
    var conn = mysql.createConnection({
      // host     : 'localhost',
      // user     : 'root',
      // port     : 3306,
      // password : '111111',
      // database : 'pro2'
      host      : '117.17.198.39',
      user      : 'webprog',
      password  : 'its_319',
      database  : 'webprogramming',
      port      : '33306'
    });
    conn.connect();
    return conn;
}