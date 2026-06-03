'use strict';

const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/AppError');

/**
 * Middleware: reads express-validator results and throws ValidationError if any
 */
const validate = (req, _res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return next(new ValidationError(errors));
  }

  next();
};

module.exports = validate;