var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);
var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/',auth);

var topic = require('./routes/mysql/topic')();
app.use('/topic',topic);
var conn = require('./config/mysql/db')();


app.set('view engine', 'pug'); 
app.set('views', './views/mysql');

app.get('/',function(req,res){
    var sql = 'select * from topic where open=0';
    if(req.user){
        console.log(req.user);
        res.redirect("/topic");
    } else {
        conn.query(sql, function(err, topics, field){
            if(!err){
                res.render("new", {topics:topics});
            }else{
                console.log(err);
            }
        })
    }
})
app.listen(3000,function(){
    console.log('3000 gogo pugtest');
})