const mongoose = require('mongoose');
const Schedule = require('../models/Schedule');
const memoryStore = require('../store/memoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getSchedules = async (req, res) => {
  try {
    if (isDbConnected()) {
      const schedules = await Schedule.find();
      res.json(schedules);
    } else {
      res.json(memoryStore.schedules);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch device schedules', error: error.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { name, deviceId, deviceName, time, action, repeat } = req.body;
    if (!name || !deviceId || !time || !action) {
      return res.status(400).json({ message: 'Name, deviceId, time, and action are required' });
    }

    if (isDbConnected()) {
      const newSch = await Schedule.create({
        name,
        deviceId,
        deviceName: deviceName || 'Device',
        time,
        action,
        repeat: repeat || 'Daily',
        active: true
      });
      if (req.io) req.io.emit('schedule_created', newSch);
      res.status(201).json(newSch);
    } else {
      const newSch = {
        _id: 'sch_' + Date.now(),
        name,
        deviceId,
        deviceName: deviceName || 'Device',
        time,
        action,
        repeat: repeat || 'Daily',
        active: true
      };
      memoryStore.schedules.push(newSch);
      if (req.io) req.io.emit('schedule_created', newSch);
      res.status(201).json(newSch);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create schedule', error: error.message });
  }
};

exports.toggleSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    let updated;

    if (isDbConnected()) {
      const sch = await Schedule.findById(id);
      if (!sch) return res.status(404).json({ message: 'Schedule not found' });
      sch.active = !sch.active;
      await sch.save();
      updated = sch;
    } else {
      const sch = memoryStore.schedules.find(s => s._id === id);
      if (!sch) return res.status(404).json({ message: 'Schedule not found' });
      sch.active = !sch.active;
      updated = sch;
    }

    if (req.io) req.io.emit('schedule_updated', updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle schedule state', error: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await Schedule.findByIdAndDelete(id);
    } else {
      memoryStore.schedules = memoryStore.schedules.filter(s => s._id !== id);
    }

    if (req.io) req.io.emit('schedule_deleted', { id });
    res.json({ message: 'Schedule removed successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete schedule', error: error.message });
  }
};
