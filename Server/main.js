/*init setting*/
//module
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//middleware
app.use(express.static('../Client/public')); //정적파일 서비스->수정후 서버 재실행 필요X
app.use(bodyParser.urlencoded({extended: false}));
//pug
app.locals.pretty = true;
app.set('views', './views');
app.set('view engine', 'pug'); //pug연결
//root page
app.get('/', function(req, res){
  res.send('<img src="/mainHeader.png">');
});
/**/

//other page linkage
app.get('/login', function(req, res){
  res.send('Login please');
});
app.get('/logout', function(req, res){
  res.send('Completed Logout');
});
app.get('/content', function(req, res){
  res.send('Write down your story');
});
app.get('/contents', function(req, res){
  res.render('contents'); //form_receiver.pug -> contents.pug
});
app.get('/queryTest', function(req, res){ //query test
  res.send(req.query.id+','+req.query.name);
});
app.listen(3000, function(){
  console.log('Connected 3000port!');
});

//POST
app.post('/contents_receiver', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  res.send('title is '+title+'</p>discription is '+description);
});