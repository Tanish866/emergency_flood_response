const validateSendMessage = (body) => {
  const errors = [];
  const { text } = body || {};

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    errors.push('text is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    return { error: errors, value: null };
  }

  return { error: null, value: { text: text.trim() } };
};

module.exports = { validateSendMessage };