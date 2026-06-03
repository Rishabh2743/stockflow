'use strict';

const { StatusCodes } = require('http-status-codes');

/**
 * Send a consistent success response
 */
const sendSuccess = (res, { data = null, message = 'Success', statusCode = StatusCodes.OK, meta = null } = {}) => {
  const body = {
    success: true,
    message,
    data,
  };

  if (meta) body.meta = meta;

  return res.status(statusCode).json(body);
};

/**
 * Send a consistent error response
 */
const sendError = (res, { message = 'Something went wrong', statusCode = StatusCodes.INTERNAL_SERVER_ERROR, errors = null } = {}) => {
  const body = {
    success: false,
    message,
  };

  if (errors) body.errors = errors;

  return res.status(statusCode).json(body);
};

module.exports = { sendSuccess, sendError };