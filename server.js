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
    //welcome current user
   socket.emit('message', 'welcome to chat');

   //This line is broadcast when a new user connects
   socket.broadcast.emit('message', 'a new user has joined the chat');

   //Runs when client disconnects
   socket.on('disconnect', () => {
       io.emit('message', 'a user has left the chat');
   });

});

const PORT = 8080 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

