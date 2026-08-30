const express = require('express');
const routeController = require('../controllers/route.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.post('/safe', routeController.getSafeRoute);
router.post('/recalculate', routeController.recalculateRoute);

module.exports = router;
