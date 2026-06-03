'use strict';

const { Router } = require('express');
const rateLimiter     = require('../middleware/rateLimiter');
const authenticate    = require('../middleware/authenticate');
const authRoutes      = require('../modules/auth/auth.routes');
const productRoutes   = require('../modules/products/product.routes');
const dashboardRoutes = require('../modules/dashboard/dashboard.routes');
const settingsRoutes  = require('../modules/settings/settings.routes');

const router = Router();

router.use(rateLimiter.apiLimiter);

router.use('/auth',      authRoutes);
router.use('/products',  authenticate, productRoutes);
router.use('/dashboard', authenticate, dashboardRoutes);
router.use('/settings',  authenticate, settingsRoutes);

module.exports = router;