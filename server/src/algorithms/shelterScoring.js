const { haversineDistanceKm } = require('../utils/distance');

const DISTANCE_WEIGHT = 1;
const OCCUPANCY_WEIGHT = 40;
const RISK_WEIGHT = 0.5;
const ROUTE_DIFFICULTY_WEIGHT = 1;

const calculateShelterScore = ({ shelter, originLocation, riskScore = 0, routeDifficulty = 0 }) => {
  const distanceKm = haversineDistanceKm(originLocation.coordinates, shelter.location.coordinates);

  const occupancyRatio = shelter.capacity > 0 ? shelter.currentOccupancy / shelter.capacity : 1;
  const occupancyComponent = occupancyRatio * OCCUPANCY_WEIGHT;

  const riskComponent = riskScore * RISK_WEIGHT;
  const routeDifficultyComponent = routeDifficulty * ROUTE_DIFFICULTY_WEIGHT;

  const score =
    distanceKm * DISTANCE_WEIGHT + occupancyComponent + riskComponent + routeDifficultyComponent;

  return {
    score,
    distanceKm,
    occupancyComponent,
    riskComponent,
    routeDifficultyComponent,
  };
};

const rankShelters = ({ shelters, originLocation, riskByShelterId = {}, routeDifficultyByShelterId = {} }) => {
  return shelters
    .map((shelter) => ({
      shelter,
      scoring: calculateShelterScore({
        shelter,
        originLocation,
        riskScore: riskByShelterId[shelter._id.toString()] || 0,
        routeDifficulty: routeDifficultyByShelterId[shelter._id.toString()] || 0,
      }),
    }))
    .sort((a, b) => a.scoring.score - b.scoring.score);
};

module.exports = { calculateShelterScore, rankShelters };
