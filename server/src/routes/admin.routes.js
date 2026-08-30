const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/dashboard', adminController.getDashboard);
router.get('/help-requests', adminController.getHelpRequests);
router.get('/rescue-teams', adminController.getRescueTeams);
router.get('/shelters', adminController.getShelters);
router.patch('/roads/:id', adminController.updateRoad);
router.patch('/shelters/:id', adminController.updateShelter);
router.patch('/rescue-teams/:id', adminController.updateRescueTeam);
router.patch('/risk-zones/:id', adminController.updateRiskZone);

module.exports = router;
