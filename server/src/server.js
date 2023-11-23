import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { routes, __dirname } from './routes.js';
import cors from 'cors';
import path from 'path';

const server = express();
server.use(cors());
const httpServer = createServer(server);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your frontend URL
  }
});

// Mudar a localização da pasta views
server.set('views', path.join(__dirname, 'views'));

// habilitar arquivos statics
server.use(express.static('public'));

// usar o req.body
server.use(express.urlencoded({ extended: true }));

// allowing json
server.use(express.json());

// routes
server.use(routes);

// Socket.IO integration
io.on('connection', (socket) => {
  console.log('a user connected');

  // Listen for captured frames from the client
  socket.on('camera stream', (frameData) => {
    // Broadcast the frame to all connected clients
    // console.log(frameData);
    io.emit('video stream', frameData);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(3000, async () => {
  console.log('Server running on http://localhost:3000');
});
