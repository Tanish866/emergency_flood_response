const { ROLES } = require('../utils/constants');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (body) => {
  const errors = [];
  const { name, phone, email, password, role } = body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name is required and must be at least 2 characters');
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
    errors.push('phone is required and must be valid');
  }
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    errors.push('a valid email is required');
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('password is required and must be at least 8 characters');
  }
  if (role && !Object.values(ROLES).includes(role)) {
    errors.push(`role must be one of ${Object.values(ROLES).join(', ')}`);
  }

  if (errors.length > 0) {
    return { error: errors, value: null };
  }

  return {
    error: null,
    value: {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: role || ROLES.USER,
    },
  };
};

const validateLogin = (body) => {
  const errors = [];
  const { email, password } = body || {};

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    errors.push('a valid email is required');
  }
  if (!password || typeof password !== 'string') {
    errors.push('password is required');
  }

  if (errors.length > 0) {
    return { error: errors, value: null };
  }

  return { error: null, value: { email: email.trim().toLowerCase(), password } };
};

module.exports = { validateRegister, validateLogin };
