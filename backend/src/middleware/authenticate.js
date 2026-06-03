'use strict';

const { verifyToken } = require('../lib/jwt');
const { UnauthorizedError } = require('../utils/AppError');

/**
 * Middleware: verifies JWT from cookie and attaches userId + organizationId to req
 */
const authenticate = (req, _res, next) => {
  console.log("AUTHENTICATE CALLED", req.method, req.originalUrl);
  const token = req.cookies?.token;

  if (!token) {
    return next(new UnauthorizedError('No session found. Please log in.'));
  }

  const payload = verifyToken(token); // throws AppError on failure
  req.userId = payload.userId;
  req.organizationId = payload.organizationId;
  next();
};

module.exports = authenticate;