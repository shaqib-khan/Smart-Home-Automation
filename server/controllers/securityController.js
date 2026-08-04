const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const memoryStore = require('../store/memoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getSecurityStatus = async (req, res) => {
  try {
    res.json(memoryStore.security);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve security status', error: error.message });
  }
};

exports.toggleDoorLock = async (req, res) => {
  try {
    const { pinCode } = req.body;
    if (pinCode && pinCode !== memoryStore.security.pinCode) {
      return res.status(401).json({ message: 'Invalid PIN Code' });
    }

    memoryStore.security.doorLocked = !memoryStore.security.doorLocked;
    const action = memoryStore.security.doorLocked ? 'LOCKED' : 'UNLOCKED';

    const notif = {
      _id: 'notif_' + Date.now(),
      type: 'SECURITY',
      message: `Main Entrance Door ${action} by User`,
      timestamp: new Date().toISOString(),
      read: false
    };
    memoryStore.notifications.unshift(notif);

    if (req.io) {
      req.io.emit('security_updated', memoryStore.security);
      req.io.emit('new_notification', notif);
    }

    res.json({ doorLocked: memoryStore.security.doorLocked, message: `Door ${action} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change door status', error: error.message });
  }
};

exports.toggleAlarm = async (req, res) => {
  try {
    memoryStore.security.alarmActive = !memoryStore.security.alarmActive;
    const action = memoryStore.security.alarmActive ? 'ACTIVATED' : 'DISARMED';

    const notif = {
      _id: 'notif_' + Date.now(),
      type: 'SECURITY',
      message: `Home Alarm System ${action}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    memoryStore.notifications.unshift(notif);

    if (req.io) {
      req.io.emit('security_updated', memoryStore.security);
      req.io.emit('new_notification', notif);
    }

    res.json({ alarmActive: memoryStore.security.alarmActive, message: `Alarm ${action}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update alarm state', error: error.message });
  }
};

exports.simulateMotion = async (req, res) => {
  try {
    const { room = 'Living Room' } = req.body;
    memoryStore.security.motionDetected = true;

    const notif = {
      _id: 'notif_' + Date.now(),
      type: 'SECURITY',
      message: `INTRUDER ALERT: Unexpected motion detected in ${room}!`,
      timestamp: new Date().toISOString(),
      read: false
    };
    memoryStore.notifications.unshift(notif);

    // Automatic rule execution simulation: Turn on Light/Alarm
    const light = memoryStore.devices.find(d => d.room === room && d.category === 'Lighting');
    if (light) {
      light.state = true;
      if (req.io) req.io.emit('device_updated', light);
    }

    if (req.io) {
      req.io.emit('security_updated', memoryStore.security);
      req.io.emit('new_notification', notif);
    }

    // Reset motion after 10s simulation
    setTimeout(() => {
      memoryStore.security.motionDetected = false;
      if (req.io) req.io.emit('security_updated', memoryStore.security);
    }, 10000);

    res.json({ message: `Motion simulated in ${room}`, security: memoryStore.security });
  } catch (error) {
    res.status(500).json({ message: 'Failed to trigger motion simulation', error: error.message });
  }
};
