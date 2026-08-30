const { isValidCoordinates } = require('../utils/distance');
const { HELP_REQUEST_SEVERITY } = require('../utils/constants');

const validateCreateHelpRequest = (body) => {
  const errors = [];
  const { location, severity, peopleCount, description } = body || {};

  if (!location || !isValidCoordinates(location.coordinates)) {
    errors.push('location.coordinates must be a valid [longitude, latitude] pair');
  }
  if (!severity || !Object.values(HELP_REQUEST_SEVERITY).includes(severity)) {
    errors.push(`severity must be one of ${Object.values(HELP_REQUEST_SEVERITY).join(', ')}`);
  }
  if (!Number.isInteger(peopleCount) || peopleCount < 1) {
    errors.push('peopleCount must be a positive integer');
  }
  if (description !== undefined && typeof description !== 'string') {
    errors.push('description must be a string');
  }

  if (errors.length > 0) {
    return { error: errors, value: null };
  }

  return {
    error: null,
    value: {
      location: { type: 'Point', coordinates: location.coordinates },
      severity,
      peopleCount,
      description: description || '',
    },
  };
};

const { HELP_REQUEST_STATUS } = require('../utils/constants');

const validateStatusUpdate = (body) => {
  const errors = [];
  const { status } = body || {};

  if (!status || !Object.values(HELP_REQUEST_STATUS).includes(status)) {
    errors.push(`status must be one of ${Object.values(HELP_REQUEST_STATUS).join(', ')}`);
  }

  if (errors.length > 0) {
    return { error: errors, value: null };
  }

  return { error: null, value: { status } };
};

module.exports = { validateCreateHelpRequest, validateStatusUpdate };
