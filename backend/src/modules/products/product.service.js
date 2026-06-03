'use strict';

const prisma = require('../../lib/prisma');
const { NotFoundError, ConflictError } = require('../../utils/AppError');
const logger = require('../../lib/logger');

// ── Private helpers ────────────────────────────────────────────────────────────

/**
 * Verify product belongs to org — throws if not found
 */
const _findProductOrThrow = async (id, organizationId) => {
  const product = await prisma.product.findFirst({
    where: { id, organizationId, deletedAt: null },
  });

  if (!product) throw new NotFoundError('Product');

  return product;
};

/**
 * Check SKU uniqueness within org, optionally excluding a product ID
 */
const _assertSkuUnique = async (sku, organizationId, excludeId = null) => {
  const conflict = await prisma.product.findFirst({
    where: {
      sku,
      organizationId,
      deletedAt: null,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });

  if (conflict) {
    throw new ConflictError(`SKU "${sku}" already exists in your organization.`);
  }
};

// ── Public service methods ─────────────────────────────────────────────────────

const getProducts = async ({ organizationId, search, page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    organizationId,
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        sku: true,
        description: true,
        quantityOnHand: true,
        costPrice: true,
        sellingPrice: true,
        lowStockThreshold: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProductById = async (id, organizationId) => {
  return _findProductOrThrow(id, organizationId);
};

const createProduct = async ({ organizationId, name, sku, description, quantityOnHand = 0, costPrice, sellingPrice, lowStockThreshold }) => {
  await _assertSkuUnique(sku, organizationId);

  const product = await prisma.product.create({
    data: { organizationId, name, sku, description, quantityOnHand, costPrice, sellingPrice, lowStockThreshold },
  });

  logger.info('Product created', { productId: product.id, orgId: organizationId, sku });

  return product;
};

const updateProduct = async (id, organizationId, updates) => {
  await _findProductOrThrow(id, organizationId);

  if (updates.sku) {
    await _assertSkuUnique(updates.sku, organizationId, id);
  }

  const product = await prisma.product.update({
    where: { id },
    data: updates,
  });

  logger.info('Product updated', { productId: id, orgId: organizationId });

  return product;
};

const deleteProduct = async (id, organizationId) => {
  await _findProductOrThrow(id, organizationId);

  // Soft delete
  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  logger.info('Product soft-deleted', { productId: id, orgId: organizationId });
};

const adjustStock = async (id, organizationId, { adjustment, note }) => {
  const product = await _findProductOrThrow(id, organizationId);

  const newQty = product.quantityOnHand + adjustment;
  if (newQty < 0) {
    throw new ConflictError('Stock adjustment would result in negative quantity.');
  }

  const updated = await prisma.product.update({
    where: { id },
    data: { quantityOnHand: newQty },
  });

  logger.info('Stock adjusted', {
    productId: id,
    orgId: organizationId,
    adjustment,
    newQty,
    note: note ?? 'No note',
  });

  return updated;
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, adjustStock };