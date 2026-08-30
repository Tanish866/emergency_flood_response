const { isValidCoordinates } = require('../utils/distance');
const { RESCUE_TEAM_STATUS } = require('../utils/constants');

const validateStatusUpdate = (body) => {
  const errors = [];
  const { status } = body || {};

  if (!status || !Object.values(RESCUE_TEAM_STATUS).includes(status)) {
    errors.push(`status must be one of ${Object.values(RESCUE_TEAM_STATUS).join(', ')}`);
  }

  if (errors.length > 0) {
    return { error: errors, value: null };
  }

  return { error: null, value: { status } };
};

const validateLocationUpdate = (body) => {
  const errors = [];
  const { coordinates } = body || {};

  if (!isValidCoordinates(coordinates)) {
    errors.push('coordinates must be a valid [longitude, latitude] pair');
  }

  if (errors.length > 0) {
    return { error: errors, value: null };
  }

  return { error: null, value: { coordinates } };
};

module.exports = { validateStatusUpdate, validateLocationUpdate };
