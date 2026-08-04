const mongoose = require('mongoose');
const Rule = require('../models/Rule');
const memoryStore = require('../store/memoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getRules = async (req, res) => {
  try {
    if (isDbConnected()) {
      const rules = await Rule.find();
      res.json(rules);
    } else {
      res.json(memoryStore.rules);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch automation rules', error: error.message });
  }
};

exports.createRule = async (req, res) => {
  try {
    const { name, trigger, action, targetDeviceId, targetState } = req.body;
    if (!name || !trigger || !action) {
      return res.status(400).json({ message: 'Name, trigger, and action are required' });
    }

    if (isDbConnected()) {
      const newRule = await Rule.create({
        name,
        trigger,
        action,
        condition: trigger,
        targetDeviceId: targetDeviceId || 'dev_1',
        targetState: targetState !== undefined ? targetState : true,
        enabled: true
      });
      if (req.io) req.io.emit('rule_created', newRule);
      res.status(201).json(newRule);
    } else {
      const newRule = {
        _id: 'rule_' + Date.now(),
        name,
        trigger,
        action,
        condition: trigger,
        targetDeviceId: targetDeviceId || 'dev_1',
        targetState: targetState !== undefined ? targetState : true,
        enabled: true
      };
      memoryStore.rules.push(newRule);
      if (req.io) req.io.emit('rule_created', newRule);
      res.status(201).json(newRule);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create automation rule', error: error.message });
  }
};

exports.toggleRule = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedRule;

    if (isDbConnected()) {
      const rule = await Rule.findById(id);
      if (!rule) return res.status(404).json({ message: 'Rule not found' });
      rule.enabled = !rule.enabled;
      await rule.save();
      updatedRule = rule;
    } else {
      const rule = memoryStore.rules.find(r => r._id === id);
      if (!rule) return res.status(404).json({ message: 'Rule not found' });
      rule.enabled = !rule.enabled;
      updatedRule = rule;
    }

    if (req.io) req.io.emit('rule_updated', updatedRule);
    res.json(updatedRule);
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle rule state', error: error.message });
  }
};

exports.deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await Rule.findByIdAndDelete(id);
    } else {
      memoryStore.rules = memoryStore.rules.filter(r => r._id !== id);
    }

    if (req.io) req.io.emit('rule_deleted', { id });
    res.json({ message: 'Rule deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete rule', error: error.message });
  }
};
