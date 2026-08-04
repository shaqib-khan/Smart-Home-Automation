const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Device = require('./models/Device');
const Room = require('./models/Room');
const Schedule = require('./models/Schedule');
const Rule = require('./models/Rule');
const Notification = require('./models/Notification');
const EnergyLog = require('./models/EnergyLog');
const memoryStore = require('./store/memoryStore');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smarthome';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('🌱 Connected to MongoDB for database seeding...');

    await User.deleteMany({});
    await Device.deleteMany({});
    await Room.deleteMany({});
    await Schedule.deleteMany({});
    await Rule.deleteMany({});
    await Notification.deleteMany({});
    await EnergyLog.deleteMany({});

    // Seed Users
    const passwordHash = await bcrypt.hash('admin123', 10);
    await User.create([
      { name: 'Alexus Admin', email: 'admin@alexus.io', passwordHash, role: 'admin' }
    ]);

    // Seed Rooms & Devices from memoryStore
    await Room.insertMany(memoryStore.rooms);
    await Device.insertMany(memoryStore.devices);
    await Schedule.insertMany(memoryStore.schedules);
    await Rule.insertMany(memoryStore.rules);
    await Notification.insertMany(memoryStore.notifications);
    await EnergyLog.insertMany(memoryStore.energyLogs);

    console.log('✅ Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.log('⚠️ Seed process skipped (MongoDB local connection unavailable). Will use memoryStore fallback.');
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
