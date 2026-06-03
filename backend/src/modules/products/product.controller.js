'use strict';

const productService = require('./product.service');
const { sendSuccess } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');
const { StatusCodes } = require('http-status-codes');
const { body } = require('express-validator');
const validate = require('../../middleware/validate');

const getProductsController = asyncHandler(async (req, res) => {
  const { search, page, limit } = req.query;

  const result = await productService.getProducts({
    organizationId: req.organizationId,
    search,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 20,
  });

  sendSuccess(res, {
    data: result.products,
    meta: result.meta,
  });
});

const getProductByIdController = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id, req.organizationId);

  sendSuccess(res, { data: product });
});

const createProductController = asyncHandler(async (req, res) => {
  const { name, sku, description, quantityOnHand, costPrice, sellingPrice, lowStockThreshold } = req.body;

  const product = await productService.createProduct({
    organizationId: req.organizationId,
    name, sku, description, quantityOnHand, costPrice, sellingPrice, lowStockThreshold,
  });

  sendSuccess(res, {
    message: 'Product created successfully.',
    data: product,
    statusCode: StatusCodes.CREATED,
  });
});

const updateProductController = asyncHandler(async (req, res) => {
  const allowed = ['name', 'sku', 'description', 'quantityOnHand', 'costPrice', 'sellingPrice', 'lowStockThreshold'];

  // Only pick allowed fields — reject unknown keys
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowed.includes(key))
  );

  const product = await productService.updateProduct(req.params.id, req.organizationId, updates);

  sendSuccess(res, {
    message: 'Product updated successfully.',
    data: product,
  });
});

const deleteProductController = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id, req.organizationId);

  sendSuccess(res, { message: 'Product deleted successfully.' });
});

const adjustStockController = asyncHandler(async (req, res) => {
  const { adjustment, note } = req.body;

  const product = await productService.adjustStock(
    req.params.id,
    req.organizationId,
    { adjustment, note }
  );

  sendSuccess(res, {
    message: 'Stock adjusted successfully.',
    data: product,
  });
});

module.exports = {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
  adjustStockController,
};