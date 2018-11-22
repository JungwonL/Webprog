var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);
var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/',auth);

var topic = require('./routes/mysql/topic')();
app.use('/topic',topic);
var conn = require('./config/mysql/db')();
// var pug =require('pug');

// var fn = pug.compile('string of pug', options);
// var html = fn('views');
app.set('view engine', 'pug'); 
app.set('views', './views/mysql')
// app.use(express.static('public'));

app.get('/',function(req,res){
        res.render("new",{user:req.user});
})
app.listen(2500,function(){
    console.log('2500 gogo pugtest');
})