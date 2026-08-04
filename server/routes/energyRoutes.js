const express = require('express');
const router = express.Router();
const energyController = require('../controllers/energyController');

router.get('/stats', energyController.getEnergyStats);

module.exports = router;
