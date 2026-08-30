const { haversineDistanceKm } = require('../utils/distance');
const { ROAD_STATUS } = require('../utils/constants');

const BLOCKED_PENALTY = 100000;
const CLOSED_PENALTY = 100000;
const HIGH_RISK_MULTIPLIER = 3;

const isRoadPassable = (road) =>
  road.status !== ROAD_STATUS.BLOCKED && road.status !== ROAD_STATUS.CLOSED;

const calculateSegmentCost = (road) => {
  if (!isRoadPassable(road)) {
    return BLOCKED_PENALTY + CLOSED_PENALTY;
  }

  const coordinates = road.geometry.coordinates;
  let lengthKm = 0;
  for (let i = 0; i < coordinates.length - 1; i += 1) {
    lengthKm += haversineDistanceKm(coordinates[i], coordinates[i + 1]);
  }

  const riskMultiplier = road.status === ROAD_STATUS.HIGH_RISK ? HIGH_RISK_MULTIPLIER : 1;

  return lengthKm * riskMultiplier + road.riskPenalty;
};

const scoreRoute = (roads) => {
  const segmentCosts = roads.map((road) => ({
    roadId: road._id,
    name: road.name,
    status: road.status,
    cost: calculateSegmentCost(road),
    passable: isRoadPassable(road),
  }));

  const totalCost = segmentCosts.reduce((sum, segment) => sum + segment.cost, 0);
  const isSafe = segmentCosts.every((segment) => segment.passable);

  return { segmentCosts, totalCost, isSafe };
};

module.exports = { isRoadPassable, calculateSegmentCost, scoreRoute };
