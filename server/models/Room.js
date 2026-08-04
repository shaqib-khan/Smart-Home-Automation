const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: 'Home' },
  temperature: { type: Number, default: 24 },
  humidity: { type: Number, default: 50 },
  targetTemp: { type: Number, default: 22 },
  activeDevices: { type: Number, default: 0 },
  totalDevices: { type: Number, default: 0 },
  status: { type: String, default: 'Optimal' }
});

module.exports = mongoose.models.Room || mongoose.model('Room', RoomSchema);
