const express = require('express');
const riskController = require('../controllers/risk.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/zones', riskController.getZones);
router.get('/nearby', riskController.getNearbyRisk);
router.post('/predict', riskController.predictRisk);
router.get('/:id', riskController.getZoneById);

module.exports = router;
