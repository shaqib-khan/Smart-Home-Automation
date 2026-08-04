const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleController');

router.get('/', ruleController.getRules);
router.post('/', ruleController.createRule);
router.patch('/:id/toggle', ruleController.toggleRule);
router.delete('/:id', ruleController.deleteRule);

module.exports = router;
