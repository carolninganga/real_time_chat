const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser } = require('./utils/users');



const app = express();
const server = http.createServer(app);
const io = socketio(server);

//this sets the static folder to serve the public folder
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'Chat Bot';
//runs when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);


//welcome current user
    socket.emit('message', formatMessage(botName, 'welcome to chat'));

//This line is broadcast when a new user connects
    socket.broadcast.to(user.room)
        .emit(
            'message',
             formatMessage(botName, `${user.username} has joined the chat`));

    })
    
   //listen for chatMessage
   socket.on('chatMessage', msg => {
       console.log(msg)
       io.emit('message', formatMessage('User', msg));
   })

   //Runs when client disconnects
   socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'a user has left the chat'));
});

});


const PORT = 8080 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

