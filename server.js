const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');



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



    // send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });

    });

   
   //listen for chatMessage
   socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

       io.to(user.room).emit('message', formatMessage(user.username, msg));
   })

   //Runs when client disconnects
   socket.on('disconnect', () => {
       const user = userLeave(socket.id)

       if(user) {
        io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

         // send users and room info
        io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });
    };

});

});


const port = process.env.PORT || 8080;

server.listen(port, () => console.log(`server running on port ${port}`));

