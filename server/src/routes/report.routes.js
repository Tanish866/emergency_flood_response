const express = require('express');
const reportController = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');
const { validateCreateReport } = require('../validators/report.validator');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

router.post('/', validate(validateCreateReport), reportController.createReport);
router.get('/nearby', reportController.getNearbyReports);
router.get('/my', reportController.getMyReports);
router.patch('/:id/verify', authorize(ROLES.ADMIN), reportController.verifyReport);
router.patch('/:id/reject', authorize(ROLES.ADMIN), reportController.rejectReport);

module.exports = router;
