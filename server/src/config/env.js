require('dotenv').config();

const DEV_FALLBACK_JWT_SECRET = 'dev-test-only-secret-do-not-use-in-production';

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
};

const requiredInProduction = ['MONGODB_URI', 'JWT_SECRET'];

if (env.NODE_ENV === 'production') {
  const missing = requiredInProduction.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
} else if (!env.JWT_SECRET) {
  env.JWT_SECRET = DEV_FALLBACK_JWT_SECRET;
  console.warn(
    'JWT_SECRET is not set. Using an insecure development/test fallback secret. Set JWT_SECRET in .env before deploying.'
  );
}

module.exports = env;