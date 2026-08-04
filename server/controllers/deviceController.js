const mongoose = require('mongoose');
const Device = require('../models/Device');
const Notification = require('../models/Notification');
const memoryStore = require('../store/memoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getDevices = async (req, res) => {
  try {
    if (isDbConnected()) {
      const devices = await Device.find();
      res.json(devices);
    } else {
      res.json(memoryStore.devices);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch devices', error: error.message });
  }
};

exports.getDeviceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const device = await Device.findById(id);
      if (!device) return res.status(404).json({ message: 'Device not found' });
      res.json(device);
    } else {
      const device = memoryStore.devices.find(d => d._id === id);
      if (!device) return res.status(404).json({ message: 'Device not found' });
      res.json(device);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving device', error: error.message });
  }
};

exports.createDevice = async (req, res) => {
  try {
    const deviceData = req.body;
    if (!deviceData.name || !deviceData.room || !deviceData.category) {
      return res.status(400).json({ message: 'Name, room, and category are required' });
    }

    if (isDbConnected()) {
      const newDev = await Device.create(deviceData);
      req.io && req.io.emit('device_created', newDev);
      res.status(201).json(newDev);
    } else {
      const newDev = {
        _id: 'dev_' + Date.now(),
        state: false,
        powerWatts: deviceData.powerWatts || 10,
        lastUpdated: new Date().toISOString(),
        icon: deviceData.icon || 'Cpu',
        ...deviceData
      };
      memoryStore.devices.push(newDev);
      req.io && req.io.emit('device_created', newDev);
      res.status(201).json(newDev);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create device', error: error.message });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.lastUpdated = new Date().toISOString();

    let updatedDevice;
    if (isDbConnected()) {
      updatedDevice = await Device.findByIdAndUpdate(id, updates, { new: true });
    } else {
      const index = memoryStore.devices.findIndex(d => d._id === id);
      if (index !== -1) {
        memoryStore.devices[index] = { ...memoryStore.devices[index], ...updates };
        updatedDevice = memoryStore.devices[index];
      }
    }

    if (!updatedDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Emit real-time update via Socket.IO
    if (req.io) {
      req.io.emit('device_updated', updatedDevice);
    }

    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update device', error: error.message });
  }
};

exports.toggleDevice = async (req, res) => {
  try {
    const { id } = req.params;
    let device;

    if (isDbConnected()) {
      device = await Device.findById(id);
      if (!device) return res.status(404).json({ message: 'Device not found' });
      device.state = !device.state;
      device.lastUpdated = new Date();
      await device.save();
    } else {
      const d = memoryStore.devices.find(dev => dev._id === id);
      if (!d) return res.status(404).json({ message: 'Device not found' });
      d.state = !d.state;
      d.lastUpdated = new Date().toISOString();
      device = d;
    }

    // Log notification
    const notifMsg = `${device.name} in ${device.room} was turned ${device.state ? 'ON' : 'OFF'}`;
    const notif = {
      _id: 'notif_' + Date.now(),
      type: 'DEVICE',
      message: notifMsg,
      timestamp: new Date().toISOString(),
      read: false
    };

    if (!isDbConnected()) {
      memoryStore.notifications.unshift(notif);
    } else {
      await Notification.create({ type: 'DEVICE', message: notifMsg });
    }

    if (req.io) {
      req.io.emit('device_updated', device);
      req.io.emit('new_notification', notif);
    }

    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle device state', error: error.message });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await Device.findByIdAndDelete(id);
    } else {
      memoryStore.devices = memoryStore.devices.filter(d => d._id !== id);
    }

    if (req.io) {
      req.io.emit('device_deleted', { id });
    }

    res.json({ message: 'Device removed successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete device', error: error.message });
  }
};
