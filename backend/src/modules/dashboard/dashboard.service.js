'use strict';

const prisma = require('../../lib/prisma');

const getDashboardSummary = async (organizationId) => {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { defaultLowStockThreshold: true },
  });

  const globalThreshold = org?.defaultLowStockThreshold ?? 5;

  const products = await prisma.product.findMany({
    where: { organizationId, deletedAt: null },
    select: {
      id: true,
      name: true,
      sku: true,
      quantityOnHand: true,
      lowStockThreshold: true,
      sellingPrice: true,
    },
  });

  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, p) => sum + p.quantityOnHand, 0);
  const totalInventoryValue = products.reduce((sum, p) => {
    return sum + (p.sellingPrice ?? 0) * p.quantityOnHand;
  }, 0);

  const lowStockItems = products
    .filter((p) => {
      const threshold = p.lowStockThreshold ?? globalThreshold;
      return p.quantityOnHand <= threshold;
    })
    .map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      quantityOnHand: p.quantityOnHand,
      lowStockThreshold: p.lowStockThreshold ?? globalThreshold,
    }));

  return {
    totalProducts,
    totalUnits,
    totalInventoryValue: parseFloat(totalInventoryValue.toFixed(2)),
    lowStockCount: lowStockItems.length,
    lowStockItems,
  };
};

module.exports = { getDashboardSummary };