const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const roomRoutes = require('./routes/roomRoutes');
const securityRoutes = require('./routes/securityRoutes');
const ruleRoutes = require('./routes/ruleRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const energyRoutes = require('./routes/energyRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const memoryStore = require('./store/memoryStore');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// Attach io instance to req for controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    dbStatus: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'In-Memory Store Active',
    timestamp: new Date().toISOString()
  });
});

// Real-Time Socket.IO Connections & Event Handlers
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to Socket.IO: ${socket.id}`);

  // Send initial real-time state sync
  socket.emit('initial_state', {
    devices: memoryStore.devices,
    rooms: memoryStore.rooms,
    security: memoryStore.security,
    notifications: memoryStore.notifications
  });

  socket.on('toggle_device_socket', ({ id }) => {
    const device = memoryStore.devices.find(d => d._id === id);
    if (device) {
      device.state = !device.state;
      device.lastUpdated = new Date().toISOString();
      io.emit('device_updated', device);

      const notif = {
        _id: 'notif_' + Date.now(),
        type: 'DEVICE',
        message: `${device.name} (${device.room}) turned ${device.state ? 'ON' : 'OFF'} via Live Command`,
        timestamp: new Date().toISOString(),
        read: false
      };
      memoryStore.notifications.unshift(notif);
      io.emit('new_notification', notif);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// MongoDB Connection Attempt with Memory Fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smarthome';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2500 })
  .then(() => console.log('🍃 Connected to MongoDB instance.'))
  .catch(() => console.log('⚡ Local MongoDB unavailable. Operating in high-speed In-Memory Data Store fallback mode!'));

server.listen(PORT, () => {
  console.log(`🚀 Smart Home Automation Backend running on http://localhost:${PORT}`);
});
