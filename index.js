const cv = require('opencv4nodejs');
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server)

const wCap = new cv.VideoCapture(0);

wCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);
wCap.set(cv.CAP_PROP_SHARPNESS, 100);
wCap.set(cv.CAP_PROP_SATURATION, 80);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

setInterval(() => {
  const frame = wCap.read();
  const image = cv.imencode('.jpg', frame).toString('base64')
  io.emit('image', image)
}, 100)

server.listen(3001);