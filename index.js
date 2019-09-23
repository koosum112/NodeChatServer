let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);


// 進入首頁
app.get('/', function (req, res) {
    // 回傳index.htmtl
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});   
  });
 
  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', {user: nickname, event: 'joined'});    
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
  });
});
 
var port = process.env.PORT || 3000;
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});