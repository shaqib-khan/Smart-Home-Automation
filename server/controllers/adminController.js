const mongoose = require('mongoose');
const User = require('../models/User');
const Device = require('../models/Device');
const memoryStore = require('../store/memoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getUsers = async (req, res) => {
  try {
    if (isDbConnected()) {
      const users = await User.find().select('-passwordHash');
      res.json(users);
    } else {
      const users = memoryStore.users.map(({ passwordHash, ...u }) => u);
      res.json(users);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users list', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await User.findByIdAndDelete(id);
    } else {
      memoryStore.users = memoryStore.users.filter(u => u._id !== id);
    }
    res.json({ message: 'User account removed successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

exports.getSystemLogs = async (req, res) => {
  try {
    res.json(memoryStore.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch audit logs', error: error.message });
  }
};
