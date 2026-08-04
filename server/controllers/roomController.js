const mongoose = require('mongoose');
const Room = require('../models/Room');
const Device = require('../models/Device');
const memoryStore = require('../store/memoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getRooms = async (req, res) => {
  try {
    if (isDbConnected()) {
      const rooms = await Room.find();
      const devices = await Device.find();
      const populatedRooms = rooms.map(room => {
        const roomDevs = devices.filter(d => d.room === room.name);
        const activeCount = roomDevs.filter(d => d.state).length;
        return {
          ...room.toObject(),
          activeDevices: activeCount,
          totalDevices: roomDevs.length
        };
      });
      res.json(populatedRooms);
    } else {
      const rooms = memoryStore.rooms.map(room => {
        const roomDevs = memoryStore.devices.filter(d => d.room === room.name);
        return {
          ...room,
          activeDevices: roomDevs.filter(d => d.state).length,
          totalDevices: roomDevs.length
        };
      });
      res.json(rooms);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
  }
};

exports.updateRoomTemp = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetTemp, temperature } = req.body;

    let updatedRoom;
    if (isDbConnected()) {
      updatedRoom = await Room.findByIdAndUpdate(id, { targetTemp, temperature }, { new: true });
    } else {
      const room = memoryStore.rooms.find(r => r._id === id);
      if (room) {
        if (targetTemp !== undefined) room.targetTemp = targetTemp;
        if (temperature !== undefined) room.temperature = temperature;
        updatedRoom = room;
      }
    }

    if (!updatedRoom) return res.status(404).json({ message: 'Room not found' });

    if (req.io) {
      req.io.emit('room_updated', updatedRoom);
    }

    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update room climate', error: error.message });
  }
};
