'use strict';

const prisma = require('../../lib/prisma');
const { NotFoundError } = require('../../utils/AppError');
const logger = require('../../lib/logger');

const getSettings = async (organizationId) => {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true, name: true, defaultLowStockThreshold: true, createdAt: true },
  });

  if (!org) throw new NotFoundError('Organization');

  return org;
};

const updateSettings = async (organizationId, { defaultLowStockThreshold }) => {
  const org = await prisma.organization.update({
    where: { id: organizationId },
    data: { defaultLowStockThreshold },
    select: { id: true, name: true, defaultLowStockThreshold: true },
  });

  logger.info('Settings updated', { orgId: organizationId, defaultLowStockThreshold });

  return org;
};

module.exports = { getSettings, updateSettings };