'use strict';

const { Router } = require('express');
const { signupController, loginController, logoutController, getMeController } = require('./auth.controller');
const { signupValidators, loginValidators } = require('./auth.validators');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const { authLimiter } = require('../../middleware/rateLimiter');

const router = Router();

router.post('/signup', authLimiter, signupValidators, validate, signupController);
//router.post('/signup', signupController);
router.post('/login',  authLimiter, loginValidators,  validate, loginController);
//router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/me',      authenticate, getMeController);
//router.get('/me',     getMeController);

module.exports = router;