const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  condition: { type: String, required: true },
  trigger: { type: String, required: true },
  action: { type: String, required: true },
  targetDeviceId: { type: String, required: true },
  targetState: { type: Boolean, default: true },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.models.Rule || mongoose.model('Rule', RuleSchema);
