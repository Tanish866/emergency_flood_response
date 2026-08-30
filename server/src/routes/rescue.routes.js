const express = require('express');
const rescueController = require('../controllers/rescue.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');
const { validateStatusUpdate, validateLocationUpdate } = require('../validators/rescue.validator');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

router.get('/nearby', rescueController.getNearbyTeams);
router.get('/me/requests', authorize(ROLES.RESCUE_TEAM), rescueController.getMyRequests);
router.get('/me/stats', authorize(ROLES.RESCUE_TEAM), rescueController.getMyStats);
router.patch('/status', authorize(ROLES.RESCUE_TEAM), validate(validateStatusUpdate), rescueController.updateStatus);
router.patch('/location', authorize(ROLES.RESCUE_TEAM), validate(validateLocationUpdate), rescueController.updateLocation);
router.get('/:id', rescueController.getTeamById);
router.get('/', rescueController.getTeams);

module.exports = router;