import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import { connectdb } from './mongodb.js';
import { chatModel } from './chat.schema.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

connectdb();
// Middleware for serving static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname)));

// Serve the main HTML file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Maintain a list of connected users
const connectedUsers = new Set();

io.on('connection', (socket) => {
  console.log('Connection is established');

  socket.on('join', (data) => {
    socket.username = data;
    connectedUsers.add(socket.username);

    // Notify all clients about the updated user count and list
    io.emit('update_users', {
      userCount: connectedUsers.size,
      users: Array.from(connectedUsers),
    });

    chatModel
      .find()
      .sort({ timestamp: 1 })
      .limit(50)
      .then((messages) => {
        console.log(messages);
        socket.emit('load_messages', messages);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('new_message', (message) => {
    let userMessage = {
      username: socket.username,
      message: message,
    };

    const newChat = new chatModel({
      username: socket.username,
      message: message,
      timestamp: new Date(),
    });

    newChat.save().then(() => {
      io.emit('broadcast_message', userMessage);
    });
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(socket.username);

    // Notify all clients about the updated user count and list
    io.emit('update_users', {
      userCount: connectedUsers.size,
      users: Array.from(connectedUsers),
    });

    console.log('Connection is disconnected');
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});