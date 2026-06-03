'use strict';

const { PrismaClient } = require('@prisma/client');
const config = require('../config');

const prisma = new PrismaClient({
  log: config.app.isDev
    ? [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ]
    : [
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
});

if (config.app.isDev) {
  prisma.$on('query', (e) => {
    console.log('[Prisma Query]', e.query, '|', e.params, '|', e.duration + 'ms');
  });
}

prisma.$on('warn',  (e) => console.warn('[Prisma Warn]', e.message));
prisma.$on('error', (e) => console.error('[Prisma Error]', e.message));

const gracefulDisconnect = async () => {
  await prisma.$disconnect();
  console.log('[Prisma] Client disconnected');
};

process.on('beforeExit', gracefulDisconnect);
process.on('SIGINT',     gracefulDisconnect);
process.on('SIGTERM',    gracefulDisconnect);

module.exports = prisma;