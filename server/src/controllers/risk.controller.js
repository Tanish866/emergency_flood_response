const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { isValidCoordinates } = require('../utils/distance');
const riskService = require('../services/risk.service');

const getZones = asyncHandler(async (req, res) => {
  const zones = await riskService.listRiskZones();
  return res.status(200).json(new ApiResponse(200, zones, 'Risk zones fetched'));
});

const getZoneById = asyncHandler(async (req, res) => {
  const zone = await riskService.getRiskZoneById(req.params.id);
  return res.status(200).json(new ApiResponse(200, zone, 'Risk zone fetched'));
});

const getNearbyRisk = asyncHandler(async (req, res) => {
  const { lng, lat, maxDistanceKm } = req.query;
  const coordinates = [Number(lng), Number(lat)];

  if (!isValidCoordinates(coordinates)) {
    throw new ApiError(400, 'lng and lat query parameters must form a valid coordinate pair');
  }

  const zones = await riskService.findNearbyRiskZones({
    coordinates,
    ...(maxDistanceKm ? { maxDistanceKm: Number(maxDistanceKm) } : {}),
  });

  return res.status(200).json(new ApiResponse(200, zones, 'Nearby risk zones fetched'));
});

const predictRisk = asyncHandler(async (req, res) => {
  const prediction = await riskService.predictRisk(req.body);
  return res.status(200).json(new ApiResponse(200, prediction, 'Risk prediction generated'));
});

module.exports = { getZones, getZoneById, getNearbyRisk, predictRisk };
