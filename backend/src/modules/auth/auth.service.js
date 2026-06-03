'use strict';

const bcrypt = require('bcryptjs');
const prisma = require('../../lib/prisma');
const { signToken } = require('../../lib/jwt');
const { ConflictError, UnauthorizedError } = require('../../utils/AppError');
const logger = require('../../lib/logger');

/**
 * Register a new user and organization
 */
const signup = async ({ email, password, organizationName }) => {
  // Check for existing user
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError('An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Create org + user in a transaction
  const { user, organization } = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: { name: organizationName },
    });

    const user = await tx.user.create({
      data: { email, passwordHash, organizationId: organization.id },
      select: { id: true, email: true, organizationId: true, createdAt: true },
    });

    return { user, organization };
  });

  logger.info('New user signed up', { userId: user.id, orgId: organization.id });

  const token = signToken({ userId: user.id, organizationId: organization.id });

  return {
    token,
    user: { id: user.id, email: user.email, organizationId: user.organizationId },
    organization: { id: organization.id, name: organization.name },
  };
};

/**
 * Login an existing user
 */
const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Use same error for both wrong email and wrong password (prevent enumeration)
  if (!user) {
    throw new UnauthorizedError('Invalid email or password.');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    logger.warn('Failed login attempt', { email });
    throw new UnauthorizedError('Invalid email or password.');
  }

  logger.info('User logged in', { userId: user.id });

  const token = signToken({ userId: user.id, organizationId: user.organizationId });

  return {
    token,
    user: { id: user.id, email: user.email, organizationId: user.organizationId },
  };
};

/**
 * Get current authenticated user profile
 */
const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
      organization: {
        select: {
          id: true,
          name: true,
          defaultLowStockThreshold: true,
        },
      },
    },
  });

  if (!user) throw new UnauthorizedError('User not found.');

  return user;
};

module.exports = { signup, login, getMe };