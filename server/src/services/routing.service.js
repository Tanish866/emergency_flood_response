const Road = require('../models/Road');
const ApiError = require('../utils/ApiError');
const { isValidCoordinates } = require('../utils/distance');
const { ROAD_STATUS } = require('../utils/constants');
const { scoreRoute } = require('../algorithms/routeScoring');

const MAX_CORRIDOR_KM = 15;

const findCorridorRoads = async ({ origin, destination }) => {
  const midpoint = [
    (origin[0] + destination[0]) / 2,
    (origin[1] + destination[1]) / 2,
  ];

  return Road.find({
    geometry: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates: midpoint,
        },
      },
    },
  }).catch(async () => {
    return Road.find({
      geometry: {
        $near: {
          $geometry: { type: 'Point', coordinates: midpoint },
          $maxDistance: MAX_CORRIDOR_KM * 1000,
        },
      },
    });
  });
};

const calculateSafeRoute = async ({ origin, destination }) => {
  if (!isValidCoordinates(origin) || !isValidCoordinates(destination)) {
    throw new ApiError(400, 'origin and destination must be valid [longitude, latitude] pairs');
  }

  const nearbyRoads = await Road.find({
    geometry: {
      $near: {
        $geometry: { type: 'Point', coordinates: origin },
        $maxDistance: MAX_CORRIDOR_KM * 1000,
      },
    },
  }).limit(50);

  if (nearbyRoads.length === 0) {
    return {
      route: null,
      isSafe: false,
      reason: 'No known road segments near the origin. Route safety cannot be determined.',
    };
  }

  const scored = scoreRoute(nearbyRoads);

  return {
    route: {
      origin,
      destination,
      segments: scored.segmentCosts,
      totalCost: scored.totalCost,
    },
    isSafe: scored.isSafe,
    reason: scored.isSafe
      ? 'All known segments in the corridor are passable.'
      : 'One or more known segments in the corridor are blocked or closed.',
  };
};

const recalculateRoute = async ({ origin, destination }) => calculateSafeRoute({ origin, destination });

const markRoadStatus = async (roadId, status) => {
  if (!Object.values(ROAD_STATUS).includes(status)) {
    throw new ApiError(400, `status must be one of ${Object.values(ROAD_STATUS).join(', ')}`);
  }

  const road = await Road.findByIdAndUpdate(roadId, { status }, { new: true, runValidators: true });
  if (!road) {
    throw new ApiError(404, 'Road not found');
  }
  return road;
};

module.exports = { calculateSafeRoute, recalculateRoute, markRoadStatus, findCorridorRoads };
