'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const config = require('./config');
const logger = require('./lib/logger');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
app.set('trust proxy', 1);
// ── Security headers ───────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://stockflow-seven-ruddy.vercel.app'
        
      ];

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('Blocked Origin:', origin);

      return callback(
        new Error(`Origin ${origin} not allowed by CORS policy.`)
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

// ── Compression ────────────────────────────────────────────────────────────────
app.use(compression());

// ── Body parsers ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Cookie parser ──────────────────────────────────────────────────────────────
app.use(cookieParser());

// ── HTTP request logger ────────────────────────────────────────────────────────
app.use(
  morgan(config.app.isDev ? 'dev' : 'combined', {
    stream: logger.stream,
    skip: (_req, res) => config.app.isProd && res.statusCode < 400,
  })
);

// ── Health check (before rate limiting) ───────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.app.nodeEnv,
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// ── API routes ─────────────────────────────────────────────────────────────────
app.use(config.app.apiPrefix, routes);

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ── Global error handler (MUST be last) ────────────────────────────────────────
app.use(errorHandler);


module.exports = app;