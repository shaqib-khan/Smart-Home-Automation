const memoryStore = require('../store/memoryStore');

exports.getReports = async (req, res) => {
  try {
    const { period = 'daily' } = req.query; // daily, weekly, monthly
    const devices = memoryStore.devices;
    const notifications = memoryStore.notifications;

    const totalEnergy = period === 'daily' ? 14.5 : period === 'weekly' ? 98.2 : 412.0;
    const peakHour = period === 'daily' ? '19:00 - 21:00' : 'Weekend Evenings';
    const securityEventsCount = notifications.filter(n => n.type === 'SECURITY').length;

    const activityLogs = notifications.slice(0, 15).map(n => ({
      id: n._id,
      timestamp: n.timestamp,
      type: n.type,
      message: n.message
    }));

    res.json({
      period,
      generatedAt: new Date().toISOString(),
      summary: {
        totalEnergyKwh: totalEnergy,
        costEstimate: +(totalEnergy * 0.15).toFixed(2),
        activeDevicesAverage: devices.filter(d => d.state).length,
        securityEventsCount,
        peakUsageWindow: peakHour,
        systemHealth: '99.9% Uptime'
      },
      activityLogs
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
};

exports.clearNotifications = async (req, res) => {
  try {
    memoryStore.notifications = [];
    if (req.io) {
      req.io.emit('notifications_cleared');
    }
    res.json({ message: 'All activity stream logs cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear activity stream', error: error.message });
  }
};


