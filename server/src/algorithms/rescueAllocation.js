const { haversineDistanceKm } = require('../utils/distance');
const { RESCUE_TEAM_STATUS } = require('../utils/constants');

const DISTANCE_WEIGHT = 2;
const UNAVAILABLE_PENALTY = 1000;
const CAPABILITY_MISMATCH_PENALTY = 15;
const WORKLOAD_PENALTY = 20;
const PRIORITY_BONUS_WEIGHT = 0.5;

const calculateAllocationScore = ({
  team,
  requestLocation,
  requiredCapabilities = [],
  priorityScore = 0,
}) => {
  const distanceKm = haversineDistanceKm(team.location.coordinates, requestLocation.coordinates);

  const availabilityPenalty = team.status === RESCUE_TEAM_STATUS.AVAILABLE ? 0 : UNAVAILABLE_PENALTY;

  const missingCapabilities = requiredCapabilities.filter(
    (capability) => !team.capabilities.includes(capability)
  );
  const capabilityPenalty = missingCapabilities.length * CAPABILITY_MISMATCH_PENALTY;

  const workloadPenalty = team.currentRequest ? WORKLOAD_PENALTY : 0;

  const priorityBonus = priorityScore * PRIORITY_BONUS_WEIGHT;

  const score =
    distanceKm * DISTANCE_WEIGHT +
    availabilityPenalty +
    capabilityPenalty +
    workloadPenalty -
    priorityBonus;

  return {
    score,
    distanceKm,
    availabilityPenalty,
    capabilityPenalty,
    workloadPenalty,
    isEligible: team.status === RESCUE_TEAM_STATUS.AVAILABLE && !team.currentRequest,
  };
};

const selectBestTeam = ({ teams, requestLocation, requiredCapabilities = [], priorityScore = 0 }) => {
  const scored = teams
    .map((team) => ({
      team,
      allocation: calculateAllocationScore({
        team,
        requestLocation,
        requiredCapabilities,
        priorityScore,
      }),
    }))
    .filter((entry) => entry.allocation.isEligible)
    .sort((a, b) => a.allocation.score - b.allocation.score);

  if (scored.length === 0) {
    return null;
  }

  return scored[0];
};

module.exports = { calculateAllocationScore, selectBestTeam };
