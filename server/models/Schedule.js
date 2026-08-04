const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deviceId: { type: String, required: true },
  deviceName: { type: String, required: true },
  time: { type: String, required: true }, // e.g. "18:00"
  action: { type: String, enum: ['TURN_ON', 'TURN_OFF', 'TOGGLE'], required: true },
  repeat: { type: String, enum: ['Once', 'Daily', 'Weekly'], default: 'Daily' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);
