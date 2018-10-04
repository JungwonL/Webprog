var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./template.js');

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url,true).query;
  var pathname = url.parse(_url,true).pathname;
  var id;
  console.log(`중간체크 + ${pathname}`);

  if(pathname === '/'){
    console.log(`중간체크 ${pathname}은 /`)
    if(queryData.id === undefined){
      console.log(`id는 ${queryData.id}은 undefined`)
      fs.readdir('./datastring',function(error,filelist){
        var title = '글리스트';
        var description = 'description';
        var list = template.list(filelist);
        console.log('?');
        var html = //template.HTML(title,list,)
        `
        <!doctype html>
        <charset meta="utf-8">
        <html>
        <head>
        <title>메인페이지타이틀</title>
        <body>
        <h1><a href ="/">letter list</a></h1>
        ${list}
        <a href="/write"><input type="button" value="to writing"></a>
        </body>
        </html>
        `
        response.writeHead(200);
        response.end(html);
        //console.log(html);

      });
    } else {

      console.log('성공적인 id진입');
      fs.readdir('./datastring',function(error,filelist){
        fs.readFile(`datastring/${queryData.id}`,'utf8',function(err,description){
          var title = queryData.id;
          var list = template.list(filelist);
          var html = //template.HTML(title,...)
          `
          <!doctype html>
          <charset meta='utf-8'>
          <html>
          <head>
          <title><a href="/?id=${title}">${title}</a></title>
          </head>
          <body>
          <h1><a href="/?id=${title}">${title}</a></h1>
          <p>${description}</p>
          ${list}
          <br><br>
          <a href="/"><input type="button" value="to home"></a>
          </body>
          </html>
          `
          response.writeHead(200);
          response.end(html);
        })
      })
    }
  } else if(pathname === '/write'){
    fs.readdir('./datastring',function(error,filelist){
    var list = template.list(filelist);
    var html = `
    <!doctype html>
      <form action="/write_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      <h1> 글목록 </h1>
      ${list}
      `

      response.writeHead(200);
      response.end(html);
    })

  } else if(pathname === '/write_process'){
    var body='';
    request.on('data',function(data){
      body += data;
    });
    request.on('end',function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description
      fs.writeFile(`./datastring/${title}`,description, 'utf8',function(err){
        response.writeHead(302,{Location:`/?id=${title}`});
        response.end();
      })
    })

  }else {
    response.writeHead(404);
    response.end('NOt found');
          console.log('error2');
  }
  //response.end();
});

app.listen(2000);
