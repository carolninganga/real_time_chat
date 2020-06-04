const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//this sets the static folder to serve the public folder
app.use(express.static(path.join(__dirname, 'public')));

//runs when client connects
io.on('connection', socket => {
    console.log('new ws connection...');
})

const PORT = 8080 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

