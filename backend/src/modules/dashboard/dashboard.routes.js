'use strict';

const { Router } = require('express');
const { getDashboardController } = require('./dashboard.controller');

const router = Router();

router.get('/', getDashboardController);

module.exports = router;