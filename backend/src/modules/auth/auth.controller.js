'use strict';

const authService = require('./auth.service');
const { attachTokenCookie, clearTokenCookie } = require('../../lib/jwt');
const { sendSuccess } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');
const { StatusCodes } = require('http-status-codes');

const signupController = asyncHandler(async (req, res) => {
  console.log('SIGNUP CONTROLLER HIT');
  const { email, password, organizationName } = req.body;
  const result = await authService.signup({ email, password, organizationName });

  attachTokenCookie(res, result.token);

  sendSuccess(res, {
    message: 'Account created successfully.',
    data: { user: result.user, organization: result.organization },
    statusCode: StatusCodes.CREATED,
  });
});

const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  attachTokenCookie(res, result.token);

  sendSuccess(res, {
    message: 'Logged in successfully.',
    data: { user: result.user },
  });
});

const logoutController = asyncHandler(async (_req, res) => {
  clearTokenCookie(res);

  sendSuccess(res, { message: 'Logged out successfully.' });
});

const getMeController = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.userId);

  sendSuccess(res, { data: { user } });
});

module.exports = { signupController, loginController, logoutController, getMeController };