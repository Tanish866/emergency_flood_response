const express = require('express');
const helpRequestController = require('../controllers/helpRequest.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');
const {
  validateCreateHelpRequest,
  validateStatusUpdate,
} = require('../validators/helpRequest.validator');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize(ROLES.USER), validate(validateCreateHelpRequest), helpRequestController.createHelpRequest);
router.get('/my', authorize(ROLES.USER), helpRequestController.getMyRequests);
router.get('/:id', helpRequestController.getRequestById);
router.patch('/:id/accept', authorize(ROLES.RESCUE_TEAM), helpRequestController.acceptRequest);
router.patch('/:id/reject', authorize(ROLES.RESCUE_TEAM), helpRequestController.rejectRequest);
router.patch(
  '/:id/status',
  authorize(ROLES.RESCUE_TEAM, ROLES.ADMIN),
  validate(validateStatusUpdate),
  helpRequestController.updateStatus
);
router.patch('/:id/complete', authorize(ROLES.RESCUE_TEAM, ROLES.ADMIN), helpRequestController.completeRequest);

module.exports = router;
