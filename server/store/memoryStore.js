// In-Memory Data Store Fallback when MongoDB is disconnected or unavailable

class MemoryStore {
  constructor() {
    this.users = [];
    this.devices = [];
    this.rooms = [];
    this.rules = [];
    this.schedules = [];
    this.notifications = [];
    this.security = {
      doorLocked: true,
      alarmActive: false,
      motionDetected: false,
      securityMode: 'ARMED_AWAY',
      pinCode: '1234'
    };
    this.energyLogs = [];
    this.initDefaultData();
  }

  initDefaultData() {
    this.users = [
      {
        _id: 'usr_admin_1',
        name: 'Alexus Admin',
        email: 'admin@alexus.io',
        passwordHash: '$2a$10$eE0mQ.W95o/jS0QxVqA3e.u6.K.V84mY9g5W3K11y4v0.w7x.5a8i', // password: admin123
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ];

    this.rooms = [
      { _id: 'rm_1', name: 'Living Room', icon: 'Tv', temperature: 24, humidity: 48, targetTemp: 22, activeDevices: 2, totalDevices: 3, status: 'Optimal' },
      { _id: 'rm_2', name: 'Bedroom', icon: 'Bed', temperature: 22, humidity: 52, targetTemp: 21, activeDevices: 1, totalDevices: 2, status: 'Optimal' },
      { _id: 'rm_3', name: 'Kitchen', icon: 'Utensils', temperature: 26, humidity: 60, targetTemp: 24, activeDevices: 1, totalDevices: 2, status: 'Warm' },
      { _id: 'rm_4', name: 'Bathroom', icon: 'Bath', temperature: 25, humidity: 65, targetTemp: 24, activeDevices: 0, totalDevices: 1, status: 'Humid' },
      { _id: 'rm_5', name: 'Garage', icon: 'Car', temperature: 28, humidity: 45, targetTemp: 25, activeDevices: 1, totalDevices: 1, status: 'Secure' }
    ];

    this.devices = [
      { _id: 'dev_1', name: 'Living Room Light', room: 'Living Room', category: 'Lighting', state: true, powerWatts: 15, brightness: 80, color: '#ffea9f', lastUpdated: new Date().toISOString(), icon: 'Lightbulb' },
      { _id: 'dev_2', name: 'Bedroom Light', room: 'Bedroom', category: 'Lighting', state: false, powerWatts: 12, brightness: 50, color: '#ffffff', lastUpdated: new Date().toISOString(), icon: 'Lightbulb' },
      { _id: 'dev_3', name: 'Kitchen Light', room: 'Kitchen', category: 'Lighting', state: true, powerWatts: 18, brightness: 100, color: '#ffffff', lastUpdated: new Date().toISOString(), icon: 'Lightbulb' },
      { _id: 'dev_4', name: 'Ceiling Fan', room: 'Living Room', category: 'Climate', state: true, powerWatts: 45, speed: 3, lastUpdated: new Date().toISOString(), icon: 'Fan' },
      { _id: 'dev_5', name: 'Air Conditioner', room: 'Bedroom', category: 'Climate', state: true, powerWatts: 1200, temperature: 22, mode: 'Cool', lastUpdated: new Date().toISOString(), icon: 'Wind' },
      { _id: 'dev_6', name: 'Smart Plug', room: 'Living Room', category: 'Appliance', state: true, powerWatts: 60, schedule: 'Active', lastUpdated: new Date().toISOString(), icon: 'Zap' },
      { _id: 'dev_7', name: 'Water Pump', room: 'Bathroom', category: 'Utility', state: false, powerWatts: 750, flowRate: '0 L/min', lastUpdated: new Date().toISOString(), icon: 'Droplets' },
      { _id: 'dev_8', name: 'Garage Door', room: 'Garage', category: 'Security', state: false, openPercentage: 0, status: 'Closed', lastUpdated: new Date().toISOString(), icon: 'DoorClosed' },
      { _id: 'dev_9', name: 'Smart TV', room: 'Living Room', category: 'Entertainment', state: false, powerWatts: 110, volume: 24, channel: 'Netflix', lastUpdated: new Date().toISOString(), icon: 'Tv' }
    ];

    this.rules = [
      { _id: 'rule_1', name: 'Evening Ambience', condition: 'Time == 18:00', trigger: 'IF Time = 6:00 PM', action: 'Turn ON Living Room Light', targetDeviceId: 'dev_1', targetState: true, enabled: true },
      { _id: 'rule_2', name: 'Cooling Safeguard', condition: 'Temp > 30°C', trigger: 'IF Temperature > 30°C', action: 'Turn ON AC', targetDeviceId: 'dev_5', targetState: true, enabled: true },
      { _id: 'rule_3', name: 'Intruder Defense', condition: 'Motion Detected', trigger: 'IF Motion Detected', action: 'Turn ON Camera and Alarm', targetDeviceId: 'dev_8', targetState: true, enabled: true }
    ];

    this.schedules = [
      { _id: 'sch_1', name: 'Morning Lights On', deviceId: 'dev_1', deviceName: 'Living Room Light', time: '07:00', action: 'TURN_ON', repeat: 'Daily', active: true },
      { _id: 'sch_2', name: 'Night AC Shutoff', deviceId: 'dev_5', deviceName: 'Air Conditioner', time: '01:00', action: 'TURN_OFF', repeat: 'Daily', active: true },
      { _id: 'sch_3', name: 'Garage Auto Lock', deviceId: 'dev_8', deviceName: 'Garage Door', time: '22:00', action: 'TURN_OFF', repeat: 'Daily', active: true }
    ];

    this.notifications = [
      { _id: 'notif_1', type: 'SECURITY', message: 'Front Perimeter Armed in Away Mode', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
      { _id: 'notif_2', type: 'DEVICE', message: 'Living Room AC turned ON (Target: 22°C)', timestamp: new Date(Date.now() - 7200000).toISOString(), read: true },
      { _id: 'notif_3', type: 'ENERGY', message: 'Daily energy consumption target reached 75%', timestamp: new Date(Date.now() - 14400000).toISOString(), read: true }
    ];

    this.generateEnergyLogs();
  }

  generateEnergyLogs() {
    const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    this.energyLogs = hours.map((hour, idx) => ({
      _id: `nrg_${idx}`,
      time: hour,
      kwh: +(1.2 + Math.sin(idx) * 0.8 + Math.random() * 0.5).toFixed(2),
      cost: +((1.2 + Math.sin(idx) * 0.8 + Math.random() * 0.5) * 0.15).toFixed(2)
    }));
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
