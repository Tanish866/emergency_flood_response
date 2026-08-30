const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { isValidCoordinates } = require('../utils/distance');
const routingService = require('../services/routing.service');

const parseOriginDestination = (body) => {
  const { origin, destination } = body || {};

  if (!isValidCoordinates(origin) || !isValidCoordinates(destination)) {
    throw new ApiError(400, 'origin and destination must be valid [longitude, latitude] pairs');
  }

  return { origin, destination };
};

const getSafeRoute = asyncHandler(async (req, res) => {
  const { origin, destination } = parseOriginDestination(req.body);
  const result = await routingService.calculateSafeRoute({ origin, destination });
  return res.status(200).json(new ApiResponse(200, result, 'Route calculated'));
});

const recalculateRoute = asyncHandler(async (req, res) => {
  const { origin, destination } = parseOriginDestination(req.body);
  const result = await routingService.recalculateRoute({ origin, destination });
  return res.status(200).json(new ApiResponse(200, result, 'Route recalculated'));
});

module.exports = { getSafeRoute, recalculateRoute };
