const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  room: { type: String, required: true },
  category: { type: String, required: true }, // Lighting, Climate, Security, Appliance, Utility, Entertainment
  state: { type: Boolean, default: false },
  powerWatts: { type: Number, default: 0 },
  brightness: { type: Number },
  color: { type: String },
  temperature: { type: Number },
  speed: { type: Number },
  volume: { type: Number },
  openPercentage: { type: Number },
  icon: { type: String, default: 'Cpu' },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Device || mongoose.model('Device', DeviceSchema);
