const mongoose = require('mongoose');
const EnergyLog = require('../models/EnergyLog');
const memoryStore = require('../store/memoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getEnergyStats = async (req, res) => {
  try {
    const devices = isDbConnected() ? await require('../models/Device').find() : memoryStore.devices;
    
    // Calculate total active power consumption in Watts
    const activeWatts = devices.reduce((sum, d) => sum + (d.state ? (d.powerWatts || 0) : 0), 0);
    const dailyKwh = +(activeWatts * 0.024 * 0.85 + 8.4).toFixed(2);
    const weeklyKwh = +(dailyKwh * 7).toFixed(2);
    const monthlyKwh = +(dailyKwh * 30).toFixed(2);
    const estimatedCost = +(dailyKwh * 0.15).toFixed(2);

    const deviceConsumption = devices.map(d => ({
      name: d.name,
      room: d.room,
      kwh: d.state ? +((d.powerWatts * 0.024).toFixed(2)) : 0,
      percentage: d.state ? Math.min(100, Math.round((d.powerWatts / (activeWatts || 1)) * 100)) : 0
    }));

    let hourlyLogs;
    if (isDbConnected()) {
      hourlyLogs = await EnergyLog.find().sort({ date: -1 }).limit(12);
    } else {
      hourlyLogs = memoryStore.energyLogs;
    }

    res.json({
      activeWatts,
      dailyKwh,
      weeklyKwh,
      monthlyKwh,
      estimatedCost,
      hourlyLogs,
      deviceConsumption
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch energy analytics', error: error.message });
  }
};
