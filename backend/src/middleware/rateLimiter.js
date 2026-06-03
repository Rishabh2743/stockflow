'use strict';

const rateLimit = require('express-rate-limit');
const { StatusCodes } = require('http-status-codes');
const config = require('../config');

const createLimiter = (options = {}) =>
  rateLimit({
    windowMs: options.windowMs ?? config.rateLimit.windowMs,
    max: options.max ?? config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        success: false,
        message: 'Too many requests. Please slow down and try again later.',
      });
    },
  });

// General API limiter
const apiLimiter = createLimiter();

// Stricter limiter for auth routes
const authLimiter = createLimiter({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.authMax,
});

module.exports = { apiLimiter, authLimiter };