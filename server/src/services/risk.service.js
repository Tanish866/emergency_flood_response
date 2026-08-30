const RiskZone = require('../models/RiskZone');
const ApiError = require('../utils/ApiError');
const aiService = require('./ai.service');

const listRiskZones = async () => RiskZone.find();

const getRiskZoneById = async (id) => {
  const zone = await RiskZone.findById(id);
  if (!zone) {
    throw new ApiError(404, 'Risk zone not found');
  }
  return zone;
};

const findNearbyRiskZones = async ({ coordinates, maxDistanceKm = 25 }) => {
  return RiskZone.find({
    geometry: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: maxDistanceKm * 1000,
      },
    },
  });
};

const getRiskScoreNear = async ({ coordinates, maxDistanceKm = 25 }) => {
  const zones = await findNearbyRiskZones({ coordinates, maxDistanceKm });

  if (zones.length === 0) {
    return 0;
  }

  const highest = zones.reduce((max, zone) => Math.max(max, zone.riskScore), 0);
  return highest;
};

const predictRisk = async (input) => {
  return aiService.requestPrediction(input);
};

const updateRiskZoneAdmin = async (id, updates) => {
  const zone = await RiskZone.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!zone) {
    throw new ApiError(404, 'Risk zone not found');
  }
  return zone;
};

module.exports = {
  listRiskZones,
  getRiskZoneById,
  findNearbyRiskZones,
  getRiskScoreNear,
  predictRisk,
  updateRiskZoneAdmin,
};
