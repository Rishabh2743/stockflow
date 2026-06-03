'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');
const { AppError } = require('../utils/AppError');
const { StatusCodes } = require('http-status-codes');

/**
 * Sign a JWT token with userId and organizationId
 */
const signToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'stockflow-api',
    audience: 'stockflow-client',
  });
};

/**
 * Verify a JWT token — throws AppError on failure
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret, {
      issuer: 'stockflow-api',
      audience: 'stockflow-client',
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Session expired. Please log in again.', StatusCodes.UNAUTHORIZED);
    }
    throw new AppError('Invalid token. Please log in again.', StatusCodes.UNAUTHORIZED);
  }
};

/**
 * Attach JWT as httpOnly cookie on the response
 */
const attachTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.app.isProd,
    sameSite: 'none',
    maxAge: config.jwt.cookieMaxAge,
  });
};

/**
 * Clear the JWT cookie
 */
const clearTokenCookie = (res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: config.app.isProd,
    sameSite: 'none',
  });
};

module.exports = { signToken, verifyToken, attachTokenCookie, clearTokenCookie };