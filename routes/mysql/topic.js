module.exports = function (){
    var route = require('express').Router();
    var conn = require('../../config/mysql/db')();
    route.get('/add',function(req,res){
        var sql = 'select id,title from topic'
        conn.query(sql,function(err,topics,fields){
            if(err){
                console.log(err);
                res.status(500).send('err1');
            }
            res.render('topic/add',{topics:topics, user:req.user,number:3});
        });
    });
    route.get(['/master','/master/:id'],function(req,res){
        var sql1 = 'select id,title from topic';
        var id = req.params.id;
        
        console.log(sql1);
        conn.query(sql1,function(err,topics,fields){
            if(id){
                var sql = 'select * from topic where id=?';
                conn.query(sql,[id],function(err,topic,fields){
                    if(err){
                        console.log(err);
                        res.status(500).send('internal server error')
                    }else{
                        res.render('topic/masterview',{topics:topics,topic:topic[0], user:req.user,number:3})
                    }
                });                
            } else{
                console.log(topics);        
                res.render('topic/masterview',{topics:topics, user:req.user,number:3})  
            }           
        })
    });
    route.get('/',function(req,res){        
        if(!req.user){
            res.redirect('/auth/login');
        }
        var author = req.user.username;
        var sql = 'select * from topic where author=?';
        conn.query(sql,[author],function(err,topics,fields){        
            res.render('topic/view',{topics:topics, user:req.user,number:3})  
        })
    });
    route.get(['/','/:id'],function(req,res){
        var id = req.params.id;
        var author = req.user.username;
        var sql = 'select id,title from topic where author=?';
        conn.query(sql,[author],function(err,topics,fields){  
            if(id){
                var sql = 'select * from topic where id=?';
                console.log(id);
                console.log(req.user);//TT
                conn.query(sql,[id],function(err,topic,fields){
                    if(err){
                        console.log(err);
                        res.status(500).send('internal server error')
                    }else{
                        res.render('topic/view',{topics:topics,topic:topic[0], user:req.user,number:3})
                    }
                })
            } else{
                res.render('topic/view',{topics:topics, user:req.user,number:3})
            }        
        })
    });
    route.get('/by/:author',function(req,res){
        var author = req.params.author;
        var sql = 'select id,title from topic where author=?';
        if(author!=req.user.username){
            res.redirect('/topic');
        }
        conn.query(sql,[author],function(err,topics,fields){        
            res.render('topic/view',{topics:topics, user:req.user,number:3})  
        })
    });
    
   
    route.post('/add',function(req,res){
        var title = req.body.title;
        var description = req.body.description;
        console.log(req.user);


        var tag = 'tag';//<<--영헌이형 함수리턴 태그
        var author = req.user.username;
        var sql = 'insert into topic (title,description,author) values (?,?,?)';
        conn.query(sql,[title,description,author],function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            else{
                res.redirect('/topic/'+result.insertId);
            }
    
        })
    })
    route.get(['/:id/edit'],function(req,res){
        var sql = 'select id,title from topic'
        conn.query(sql,function(err,topics,fields){
            var id = req.params.id;
            if(id){
                var sql = 'select * from topic where id=?';
                conn.query(sql,[id],function(err,topic,fields){
                    if(err){
                        console.log(err);
                        res.status(500).send('internal server error')
                    }else{
                        res.render('topic/edit',{topics:topics,topic:topic[0],user:req.user,number:3})
                    }
                })
            } else{
                console.log('there is no id');
                res.status(500).send('no id')
            }         
        })
    });
    
    route.post(['/:id/edit'],function(req,res){
        var title =req.body.title;
        var description =req.body.description;
        var author =req.body.author;
        var id =req.params.id;
        var sql = 'update topic set title=?, description=?, author=? where id=?'
        conn.query(sql,[title,description,author,id],function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).send('internal serer error');
            } else {
                res.redirect('/topic/'+id);
            }
    
        })
    });
    
    route.get('/:id/delete',function(req,res){
        var sql = 'select id,title from topic'
        var id = req.params.id;
        conn.query(sql,function(err,topics,fields){
            var sql = 'select * from topic where id = ?'
            conn.query(sql,[id],function(err,topic){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal SErver Error');
                } else {
                    if(topic.length === 0 ){
                        console.log('there is no record');
                        res.status(500).send('Internal SErver Error');
                    } else {
                         //res.send(topic);
                       res.render('topic/delete',{topics:topics,topic:topic[0], user:req.user,number:3});
                    }
                   
                }
            });
        });
    })
    
    route.post('/:id/delete',function(req,res){
        var id = req.params.id;
        var sql = 'delete from topic where id=?';
        conn.query(sql,[id],function(err,result){
            res.redirect('/topic');
        })
    });
        /*
        //fs.writeFile('data/'+title,description,function(err){
            if(err){
                res.status(500).send('Internal Server Error');
            }        
            res.redirect('/topic/'+title);
        //});
        */
    return route;
}