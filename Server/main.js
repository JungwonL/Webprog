var express = require('express');
var app = express();
app.use(express.static('staticDir')); //정적파일 서비스->수정후 서버 재실행 필요X
app.get('/', function(req, res){
  res.send('<img src="/mainHeader.png">');
});
app.get('/login', function(req, res){
  res.send('Login please');
});
app.get('/logout', function(req, res){
  res.send('Completed Logout');
});
app.get('/contect', function(req, res){
  res.send('Write down your story');
});
app.listen(3000, function(){
  console.log('Connected 3000port!');
});


//(연결을 돕는)node.js -> fs, http, os
//javascript통해 사용

//(연결을 돕는)module (ex) express, underscore, jade
//npm통해 module사용

//get등 router통해 각 페이지와 연결

//(연결을 돕는)controller
