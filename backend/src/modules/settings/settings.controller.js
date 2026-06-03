'use strict';

const settingsService = require('./settings.service');
const { sendSuccess } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');

const getSettingsController = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings(req.organizationId);
  sendSuccess(res, { data: settings });
});

const updateSettingsController = asyncHandler(async (req, res) => {
  const { defaultLowStockThreshold } = req.body;
  const settings = await settingsService.updateSettings(req.organizationId, { defaultLowStockThreshold });
  sendSuccess(res, { message: 'Settings updated successfully.', data: settings });
});

module.exports = { getSettingsController, updateSettingsController };