const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['SECURITY', 'DEVICE', 'ENERGY', 'SYSTEM'], default: 'SYSTEM' },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
