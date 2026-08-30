const ApiError = require('../utils/ApiError');

const validate = (validator) => (req, res, next) => {
  const { error, value } = validator(req.body);

  if (error) {
    return next(new ApiError(400, 'Validation failed', error));
  }

  req.body = value;
  next();
};

module.exports = { validate };
