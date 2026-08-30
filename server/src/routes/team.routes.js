const express = require('express');
const teamController = require('../controllers/team.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');
const { validateSendMessage } = require('../validators/message.validator');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);
router.use(authorize(ROLES.RESCUE_TEAM, ROLES.ADMIN));

router.post('/:teamId/messages', validate(validateSendMessage), teamController.sendMessage);
router.get('/:teamId/messages', teamController.getMessages);

module.exports = router;