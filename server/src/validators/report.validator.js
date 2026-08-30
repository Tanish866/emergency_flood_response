const { isValidCoordinates } = require('../utils/distance');
const { REPORT_TYPE, HELP_REQUEST_SEVERITY } = require('../utils/constants');

const validateCreateReport = (body) => {
  const errors = [];
  const { location, type, description, image, severity } = body || {};

  if (!location || !isValidCoordinates(location.coordinates)) {
    errors.push('location.coordinates must be a valid [longitude, latitude] pair');
  }
  if (!type || !Object.values(REPORT_TYPE).includes(type)) {
    errors.push(`type must be one of ${Object.values(REPORT_TYPE).join(', ')}`);
  }
  if (severity && !Object.values(HELP_REQUEST_SEVERITY).includes(severity)) {
    errors.push(`severity must be one of ${Object.values(HELP_REQUEST_SEVERITY).join(', ')}`);
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
      type,
      description: description || '',
      image: image || null,
      severity: severity || HELP_REQUEST_SEVERITY.LOW,
    },
  };
};

module.exports = { validateCreateReport };
