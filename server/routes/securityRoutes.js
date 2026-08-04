const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');

router.get('/status', securityController.getSecurityStatus);
router.post('/toggle-lock', securityController.toggleDoorLock);
router.post('/toggle-alarm', securityController.toggleAlarm);
router.post('/simulate-motion', securityController.simulateMotion);

module.exports = router;
