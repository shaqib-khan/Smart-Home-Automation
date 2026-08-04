const mongoose = require('mongoose');

const EnergyLogSchema = new mongoose.Schema({
  time: { type: String, required: true },
  kwh: { type: Number, required: true },
  cost: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.models.EnergyLog || mongoose.model('EnergyLog', EnergyLogSchema);
