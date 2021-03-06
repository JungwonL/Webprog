module.exports=function(passport){
  console.log('in routes auth');
  var route = require('express').Router();
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var conn = require('../../config/mysql/db')();
  route.post(
      '/login',
      passport.authenticate(
        'local',
        {
          successRedirect: '/topic',
          failureRedirect: '/auth/login',
          failureFlash: true
        }
      )
    );
    
    
  route.post('/register', function(req, res){
    console.log(req.body.password);
    hasher({password:req.body.password}, function(err, pass, salt, hash){
      var user = {
        authId:'local:'+req.body.username,
        username:req.body.username,
        password:hash,
        salt:salt,
        displayName:req.body.displayName,
        picture:req.body.picture
      };
      var sql = 'INSERT INTO users SET ?';
      conn.query(sql, user, function(err, results){
        if(err){
          console.log(err);
          res.status(500);
        } else {
          req.login(user, function(err){
            req.session.save(function(){
              res.redirect('/topic');
            });
          });
        }
      });
    });
  });
  route.get('/register', function(req, res){
    var sql = 'select id,title from topic ';
    conn.query(sql,function(err,topics){
      res.render('auth/register');
    });        
  });
  route.get('/login', function(req, res){
    var sql = 'select id,title from topic ';
    conn.query(sql,function(err,topics){
      res.render('auth/login');
    });
  });
  route.post('/idcheck',function(req,res){
    var sql = 'select username from users where username=?'
    var username=req.body.username;
    conn.query(sql,[username],function(err,row){
      if(row[0]==undefined){
        res.send(username);
      }else{
        res.send('');
      }
    })
  })
  route.get('/logout', function(req, res){
    req.logout();
    req.session.save(function(){
      res.redirect('/auth/login');
    });
  });
  route.post('/logincheck',function(req,res){
    sql='select * from users where username=?';
    var username=req.body.username;
    var password=req.body.password;
    conn.query(sql,[username],function(err,row){        
        hasher({password:password, salt:row[0].salt}, function(err, pass, salt, hash){
          if(hash === row[0].password){
              res.send('로그인성공');
          } else {
              res.send('로그인실패');
          }
        })
    });
  })  
  return route;
}