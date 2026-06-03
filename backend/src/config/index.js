'use strict';

require('dotenv').config();

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`[Config] Missing required env var: ${key}`);
  return value;
};

const optionalEnv = (key, fallback) => process.env[key] ?? fallback;

const config = {
  app: {
    nodeEnv: optionalEnv('NODE_ENV', 'development'),
    port: parseInt(optionalEnv('PORT', '5000'), 10),
    apiPrefix: optionalEnv('API_PREFIX', '/api/v1'),
    isDev: optionalEnv('NODE_ENV', 'development') === 'development',
    isProd: optionalEnv('NODE_ENV', 'development') === 'production',
  },

  db: {
    url: requireEnv('DATABASE_URL'),
  },

  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
    cookieMaxAge: parseInt(optionalEnv('JWT_COOKIE_MAX_AGE', '604800000'), 10),
  },

  cors: {
    clientUrl: optionalEnv('CLIENT_URL', 'http://localhost:3000'),
    allowedOrigins: optionalEnv('ALLOWED_ORIGINS', 'http://localhost:3000').split(','),
  },

  rateLimit: {
    windowMs: parseInt(optionalEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    max: parseInt(optionalEnv('RATE_LIMIT_MAX', '100'), 10),
    authMax: parseInt(optionalEnv('AUTH_RATE_LIMIT_MAX', '10'), 10),
  },

  logging: {
    level: optionalEnv('LOG_LEVEL', 'info'),
    dir: optionalEnv('LOG_DIR', 'logs'),
  },
};

module.exports = config;