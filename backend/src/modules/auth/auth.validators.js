'use strict';

const { body } = require('express-validator');

const signupValidators = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.'),

  body('organizationName')
    .trim()
    .notEmpty().withMessage('Organization name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Organization name must be 2–100 characters.'),
];

const loginValidators = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.'),
];

module.exports = { signupValidators, loginValidators };