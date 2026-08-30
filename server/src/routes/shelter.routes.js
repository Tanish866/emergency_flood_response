const express = require('express');
const shelterController = require('../controllers/shelter.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/nearby', authenticate, shelterController.getNearbyShelters);
router.get('/recommended', authenticate, shelterController.getRecommendedShelter);
router.get('/:id', authenticate, shelterController.getShelterById);
router.get('/', authenticate, shelterController.getShelters);

module.exports = router;
