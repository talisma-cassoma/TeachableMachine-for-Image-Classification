import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { routes, __dirname } from './routes.js';
import cors from 'cors';
import path from 'path';
import zmq from 'zeromq';

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

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// ZeroMQ Subscriber
const subscriber = zmq.socket('sub');
const tcpAddress = 'tcp://127.0.0.1:5555';
subscriber.connect(tcpAddress);
subscriber.subscribe('');

subscriber.on('message', (topic, message) => {
  // Assuming the message is a binary image buffer
  const imageData = Buffer.from(message);

  // Emit the image data to connected clients
  io.emit('image', { imageData: imageData.toString('base64') });
});

httpServer.listen(3000, async () => {
  console.log('Server running on http://localhost:3000');
});
