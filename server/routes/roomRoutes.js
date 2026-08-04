const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/', roomController.getRooms);
router.patch('/:id/temp', roomController.updateRoomTemp);

module.exports = router;
