const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//this sets the static folder to serve the public folder
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'Chat Bot';
//runs when client connects
io.on('connection', socket => {
    //welcome current user
   socket.emit('message', formatMessage(botName, 'welcome to chat'));

   //This line is broadcast when a new user connects
   socket.broadcast.emit('message', formatMessage(botName, 'a new user has joined the chat'));

   //Runs when client disconnects
   socket.on('disconnect', () => {
       io.emit('message', formatMessage(botName, 'a user has left the chat'));
   });

   //listen for chatMessage
   socket.on('chatMessage', msg => {
       console.log(msg)
       io.emit('message', formatMessage('User', msg));
   })

});


const PORT = 8080 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

