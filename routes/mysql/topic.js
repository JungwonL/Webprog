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
                res.render('topic/masterview',{topics:topics, user:req.user})  
            }           
        })
    });
    route.get('/',function(req,res){        
        if(!req.user || !req.user.username){
            res.redirect('/topic/new');
        }else{
            var author = req.user.username;
            var sql = 'select * from topic where author=?';
            conn.query(sql,[author],function(err,topics,fields){        
                res.render('topic/view',{topics:topics, user:req.user})  
            })
        }
    });
    route.get(['/new','/new/:id'],function(req, res){
        var id = req.params.id;
        var sql1 = 'select * from topic where open=0 and id=?';
        var sql2 = 'select * from topic where open=0';
        if(id){
            conn.query(sql1, [id], function(err, topic, fields){
                if(!err){

                    res.render('new',{topic:topic[0]})
                }else{
                    console.log(err);
                }
            })
        } else{
            conn.query(sql2, function(err, topics, fields){
                if(!err){
                    res.render('new',{topics:topics})
                }else{
                    console.log(err);
                }
            })
        }
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
                        res.render('topic/view',{topic:topic[0], user:req.user,number:3})
                    }
                })
            } else{
                res.render('topic/view',{topics:topics, user:req.user})
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
            res.render('topic/view',{topics:topics, user:req.user})  
        })
    });
    
   
    route.post('/add',function(req,res){
        var title = req.body.title;
        var description = req.body.description;
        var opencheck = req.body.opencheck;

        var tag = 'tag';//<<--영헌이형 함수리턴 태그
        var author = req.user.username;
        var sql = 'insert into topic (title,description,author,open) values (?,?,?,?)';
        conn.query(sql,[title,description,author,opencheck],function(err,result,fields){
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
                        res.status(500).send('internal server error1')
                    }else{
                        res.render('topic/edit',{topics:topics,topic:topic[0],user:req.user})
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
        var id =req.params.id;
        var opencheck = req.body.opencheck;
        var sql = 'update topic set title=?, description=?,open=? where id=?'
        conn.query(sql,[title,description,opencheck,id],function(err,result,fields){
            if(err){
                console.log(err);
                res.status(500).send('internal serer error2');
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
    route.post('/search/auth/:username',function(req,res){
        var username = req.params.username;
        var sql = 'select * from topic where author=?';
        conn.query(sql,[username],function(err,rows){
            if(err) res.send(err);
            else 
            {
                var output = '';
                // output += '<div class="post-preview">';
                for(var i=0;i<rows.length;i++)
                {
                    output += '<a href="/topic/'+rows[i].id+'">';
                    output += '<h2 class="post-title">'+rows[i].title+'</h2>';
                    output += '<h3 class="post-subtitle">'+rows[i].description+'</h3>';
                    output += '</a>';
                    output += '<hr>';
                }
                // output += '</div>';
                               
                res.send(output);
            }
        })
    })
    route.post('/search/tag/:tag',function(req,res){
        var tag = req.params.tag;
        var sql = 'select * from topic where tag=?';
        conn.query(sql,[tag],function(err,rows){
            if(err) res.send(err);
            else 
            {
                var output = '';
                // output += '<div class="post-preview">';
                for(var i=0;i<rows.length;i++)
                {
                    output += '<a href="/topic/'+rows[i].id+'">';
                    output += '<h2 class="post-title">'+rows[i].title+'</h2>';
                    output += '<h3 class="post-subtitle">'+rows[i].description+'</h3>';
                    output += '</a>';
                    output += '<hr>';
                }
                // output += '</div>';
                               
                res.send(output);
            }
        })
    })
    

    
    return route;
}