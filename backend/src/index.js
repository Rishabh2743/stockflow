'use strict';

const app = require('./app');
const config = require('./config');
const prisma = require('./lib/prisma');

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('[DB] Database connected successfully');

    const server = app.listen(config.app.port, () => {
      console.log(`[Server] StockFlow API running on port ${config.app.port} | env: ${config.app.nodeEnv} | prefix: ${config.app.apiPrefix}`);
    });

    const shutdown = async (signal) => {
      console.log(`[Server] ${signal} received — shutting down gracefully`);

      server.close(async () => {
        console.log('[Server] HTTP server closed');
        await prisma.$disconnect();
        console.log('[DB] Database disconnected');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('[Server] Forceful shutdown after timeout');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      console.error('[Server] Unhandled Promise Rejection', reason);
      shutdown('unhandledRejection');
    });

    process.on('uncaughtException', (err) => {
      console.error('[Server] Uncaught Exception', err.message, err.stack);
      shutdown('uncaughtException');
    });

  } catch (err) {
    console.error('[Server] Failed to start server', err.message, err.stack);
    process.exit(1);
  }
};

startServer();