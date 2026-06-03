'use strict';

const { Router } = require('express');
const { getSettingsController, updateSettingsController } = require('./settings.controller');
const { body } = require('express-validator');
const validate = require('../../middleware/validate');

const router = Router();

router.get('/', getSettingsController);

router.put(
  '/',
  [
    body('defaultLowStockThreshold')
      .notEmpty().withMessage('Default low stock threshold is required.')
      .isInt({ min: 0 }).withMessage('Threshold must be a non-negative integer.')
      .toInt(),
  ],
  validate,
  updateSettingsController
);

module.exports = router;