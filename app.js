var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	fs = require('fs');

app.use(express.static(__dirname + '/public'));


server.listen(8000);
console.log('Server listening on port 8000');
console.log('Point your browser to http://localhost:8000');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

// var fps = 30;
var frame = 0;
var nextFrame = {index: 0, sec: 0};
var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
var startTime = data[0].timestamp;


// io.sockets.on("connection", function () {
//   io.sockets.emit('floorclipplane', data[0].floorClipPlane);
// });

var quesOfms = [];
var que = [];
Object.keys(data).forEach(function (key) {
  quesOfms.push(data[key].timestamp);
});

for (var i = 0; i < quesOfms.length -1; i ++) {
  que.push(quesOfms[i+1] - quesOfms[i])
}


var queIndex = 0;
function queing() {

  setTimeout(function () {
    io.sockets.emit('bodyFrame', data[queIndex]);

    if (queIndex  ==  que.length) {
      queIndex = 0;
      
    } else {
      queIndex += 1;
    }

    queing();
  }, que[queIndex]);  
}

queing()

// setInterval( function() {
//   if (data[nextFrame.index]) {

//     nextFrame.sec = data[nextFrame.index].timestamp - startTime;
//     if (nextFrame.sec == frame) {
//       io.sockets.emit('bodyFrame', data[nextFrame.index]);
//       nextFrame.index += 1; 
//     } else if (data[nextFrame.index].timestamp == data[nextFrame.index - 1].timestamp) {
//       nextFrame.index += 1; 
//     }
//     frame ++ ;
//   } else {
//     frame = 0;
//     nextFrame = {index: 0, sec: 0};
//   }
// }, 1) 



	


