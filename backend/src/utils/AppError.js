'use strict';

const { StatusCodes } = require('http-status-codes');

/**
 * Base operational error — these are expected, user-facing errors.
 * Anything that extends this is considered "safe to expose" to the client.
 */
class AppError extends Error {
  constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, errors = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors; // field-level validation errors
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(errors) {
    super('Validation failed', StatusCodes.UNPROCESSABLE_ENTITY, errors);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, StatusCodes.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, StatusCodes.UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, StatusCodes.FORBIDDEN);
    this.name = 'ForbiddenError';
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, StatusCodes.CONFLICT);
    this.name = 'ConflictError';
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
};