'use strict';

const dashboardService = require('./dashboard.service');
const { sendSuccess } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');

const getDashboardController = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getDashboardSummary(req.organizationId);

  sendSuccess(res, { data: summary });
});

module.exports = { getDashboardController };