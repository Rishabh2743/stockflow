'use strict';

const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../utils/AppError');
const { sendError } = require('../utils/response');
const logger = require('../lib/logger');

/**
 * Handle Prisma-specific errors and map to AppErrors
 */
const handlePrismaError = (err) => {
  switch (err.code) {
    case 'P2002':
      return new AppError(
        `A record with this ${err.meta?.target?.join(', ')} already exists.`,
        StatusCodes.CONFLICT
      );
    case 'P2025':
      return new AppError('Record not found.', StatusCodes.NOT_FOUND);
    case 'P2003':
      return new AppError('Referenced record does not exist.', StatusCodes.BAD_REQUEST);
    case 'P2016':
      return new AppError('Record not found.', StatusCodes.NOT_FOUND);
    default:
      return new AppError('Database error occurred.', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Global error handler — must be the last middleware registered
 */
const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (err.code && err.code.startsWith('P')) {
    error = handlePrismaError(err);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = new AppError('Invalid or expired token.', StatusCodes.UNAUTHORIZED);
  }

  if (!error.isOperational) {
    (logger?.error || console.error)('UNHANDLED ERROR', {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userId: req.userId ?? 'unauthenticated',
    });

    return sendError(res, {
      message: 'An unexpected error occurred. Please try again later.',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  (logger?.warn || console.warn)('Operational Error', {
    message: error.message,
    statusCode: error.statusCode,
    url: req.originalUrl,
    method: req.method,
    userId: req.userId ?? 'unauthenticated',
  });

  return sendError(res, {
    message: error.message,
    statusCode: error.statusCode,
    errors: error.errors ?? undefined,
  });
};

/**
 * 404 handler — for unknown routes
 */
const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found.`, StatusCodes.NOT_FOUND));
};

module.exports = { errorHandler, notFoundHandler };