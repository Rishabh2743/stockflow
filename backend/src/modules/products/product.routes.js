'use strict';

const { Router } = require('express');
const {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
  adjustStockController,
} = require('./product.controller');
const {
  createProductValidators,
  updateProductValidators,
  searchQueryValidators,
} = require('./product.validators');
const { body, param } = require('express-validator');
const validate = require('../../middleware/validate');

const router = Router();

router.get('/',    searchQueryValidators,    validate, getProductsController);
router.get('/:id', param('id').notEmpty(),  validate, getProductByIdController);
router.post('/',   createProductValidators, validate, createProductController);
router.put('/:id', updateProductValidators, validate, updateProductController);
router.delete('/:id', param('id').notEmpty(), validate, deleteProductController);

router.patch(
  '/:id/adjust-stock',
  [
    param('id').notEmpty().withMessage('Product ID is required.'),
    body('adjustment')
      .notEmpty().withMessage('Adjustment value is required.')
      .isInt().withMessage('Adjustment must be an integer (positive or negative).')
      .toInt(),
    body('note')
      .optional()
      .trim()
      .isLength({ max: 255 }).withMessage('Note must be under 255 characters.'),
  ],
  validate,
  adjustStockController
);

module.exports = router;