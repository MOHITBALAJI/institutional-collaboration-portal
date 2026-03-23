const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend URL
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle drawing events
  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data);
  });

  // Handle cursor presence
  socket.on('presence', (data) => {
    socket.broadcast.emit('presence', { ...data, id: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit('user_disconnected', socket.id);
  });
});

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Academia Connect Pro API' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
