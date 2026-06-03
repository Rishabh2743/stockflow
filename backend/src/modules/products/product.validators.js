'use strict';

const { body, query, param } = require('express-validator');

const createProductValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required.')
    .isLength({ max: 200 }).withMessage('Name must be under 200 characters.'),

  body('sku')
    .trim()
    .notEmpty().withMessage('SKU is required.')
    .isLength({ max: 100 }).withMessage('SKU must be under 100 characters.')
    .matches(/^[A-Za-z0-9_\-]+$/).withMessage('SKU can only contain letters, numbers, hyphens, and underscores.'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must be under 1000 characters.'),

  body('quantityOnHand')
    .optional()
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer.')
    .toInt(),

  body('costPrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Cost price must be a non-negative number.')
    .toFloat(),

  body('sellingPrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Selling price must be a non-negative number.')
    .toFloat(),

  body('lowStockThreshold')
    .optional({ nullable: true })
    .isInt({ min: 0 }).withMessage('Low stock threshold must be a non-negative integer.')
    .toInt(),
];

const updateProductValidators = [
  param('id').notEmpty().withMessage('Product ID is required.'),

  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty.')
    .isLength({ max: 200 }).withMessage('Name must be under 200 characters.'),

  body('sku')
    .optional()
    .trim()
    .notEmpty().withMessage('SKU cannot be empty.')
    .isLength({ max: 100 }).withMessage('SKU must be under 100 characters.')
    .matches(/^[A-Za-z0-9_\-]+$/).withMessage('SKU can only contain letters, numbers, hyphens, and underscores.'),

  body('quantityOnHand')
    .optional()
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer.')
    .toInt(),

  body('costPrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Cost price must be a non-negative number.')
    .toFloat(),

  body('sellingPrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Selling price must be a non-negative number.')
    .toFloat(),

  body('lowStockThreshold')
    .optional({ nullable: true })
    .isInt({ min: 0 }).withMessage('Low stock threshold must be a non-negative integer.')
    .toInt(),
];

const searchQueryValidators = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query too long.'),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer.')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.')
    .toInt(),
];

module.exports = { createProductValidators, updateProductValidators, searchQueryValidators };