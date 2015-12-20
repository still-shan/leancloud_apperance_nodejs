var express = require("express");
var AV = require('leanengine');

// init leanengine
var PORT = parseInt(process.env.LC_APP_PORT || 3000);
var APP_ID = process.env.LC_APP_ID;
var APP_KEY = process.env.LC_APP_KEY;
var MASTER_KEY = process.env.LC_APP_MASTER_KEY;
AV.initialize(APP_ID, APP_KEY, MASTER_KEY);

// init express
var app = express();
app.set('view engine', 'ejs');
app.use(AV.Cloud);

// the websocket middleware initialization
var expressWs = require('express-ws');
expressWs(app);

// use the web page to test the connection
app.get('/', function(req, res) {
  res.render('index');
});

// or use the command line of response to test the connection
app.get('/help', function(req, res){
  res.send('wscat -c ws://{servername}:{port}/echo');
});

// test the websocket server
app.ws('/echo', function(ws, req) {
  ws.on('message', function(msg) {
    if(msg.length > 1024){
      d = new Date();
      var data = JSON.stringify({'msg':msg.length.toString(), 'timestamp':d, 'flag': false});
      ws.send(data);
    }else{
      ws.send(msg);
    }
  });
});

var postAndComment = require('./weibo');
app.ws('/weibo', function(ws, req){
  ws.on('message', function(msg){
    msg = JSON.parse(msg);
    if(msg.image && msg.atuser && msg.text){
      var base64Data = msg.image.replace(/^data:image\/png;base64,/, "");
      var buffer_image = new Buffer(base64Data, 'base64');
      msg.image = buffer_image;
      postAndComment(msg, function(err, ret){
        if(!err){
          ws.send(JSON.stringify({msg:"微博发送成功."}));
        }else{
          ws.send(JSON.stringify({errmsg:"微博发送失败.",error:err}));
        }
      });
    }
  });
});

// start server
app.listen(PORT, function(){console.log("server running on PORT:",PORT)});
