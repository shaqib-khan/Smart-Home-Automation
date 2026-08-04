const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

router.get('/', deviceController.getDevices);
router.get('/:id', deviceController.getDeviceById);
router.post('/', deviceController.createDevice);
router.put('/:id', deviceController.updateDevice);
router.patch('/:id/toggle', deviceController.toggleDevice);
router.delete('/:id', deviceController.deleteDevice);

module.exports = router;
