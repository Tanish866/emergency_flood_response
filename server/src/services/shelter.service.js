const Shelter = require('../models/Shelter');
const RiskZone = require('../models/RiskZone');
const ApiError = require('../utils/ApiError');
const { SHELTER_STATUS } = require('../utils/constants');
const { rankShelters } = require('../algorithms/shelterScoring');

const resolveRiskLevelForShelter = async (shelter) => {
  if (shelter.riskZoneId) {
    const zone = await RiskZone.findById(shelter.riskZoneId);
    return zone ? zone.riskLevel : null;
  }

  const intersecting = await RiskZone.find({
    geometry: {
      $geoIntersects: {
        $geometry: shelter.location,
      },
    },
  }).catch(() => []);

  if (intersecting.length === 0) {
    return null;
  }

  const highest = intersecting.reduce((max, zone) => (zone.riskScore > max.riskScore ? zone : max));
  return highest.riskLevel;
};

const enrichWithRiskLevel = async (shelterDoc) => {
  const shelter = shelterDoc.toObject ? shelterDoc.toObject() : shelterDoc;
  const riskLevel = await resolveRiskLevelForShelter(shelter);
  return { ...shelter, riskLevel };
};

const enrichManyWithRiskLevel = async (shelterDocs) => Promise.all(shelterDocs.map(enrichWithRiskLevel));

const listShelters = async () => {
  const shelters = await Shelter.find();
  return enrichManyWithRiskLevel(shelters);
};

const getShelterById = async (id) => {
  const shelter = await Shelter.findById(id);
  if (!shelter) {
    throw new ApiError(404, 'Shelter not found');
  }
  return enrichWithRiskLevel(shelter);
};

const findNearbyShelters = async ({ coordinates, maxDistanceKm = 20 }) => {
  const shelters = await Shelter.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: maxDistanceKm * 1000,
      },
    },
  });
  return enrichManyWithRiskLevel(shelters);
};

const recommendShelter = async ({ coordinates, maxDistanceKm = 20 }) => {
  const nearby = await Shelter.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: maxDistanceKm * 1000,
      },
    },
  });

  const eligible = nearby.filter(
    (shelter) =>
      shelter.status !== SHELTER_STATUS.FULL &&
      shelter.status !== SHELTER_STATUS.CLOSED &&
      shelter.status !== SHELTER_STATUS.UNSAFE
  );

  if (eligible.length === 0) {
    return { recommended: null, ranked: [] };
  }

  const ranked = rankShelters({
    shelters: eligible,
    originLocation: { coordinates },
  });

  const recommended = await enrichWithRiskLevel(ranked[0].shelter);

  return { recommended, ranked };
};

const updateShelterAdmin = async (id, updates) => {
  const shelter = await Shelter.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!shelter) {
    throw new ApiError(404, 'Shelter not found');
  }
  return enrichWithRiskLevel(shelter);
};

module.exports = {
  listShelters,
  getShelterById,
  findNearbyShelters,
  recommendShelter,
  updateShelterAdmin,
};