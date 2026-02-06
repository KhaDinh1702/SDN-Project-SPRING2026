import { Router } from 'express';
import {
  registerController,
  loginController,
  forgotPasswordController,
  googleAuthController,
  refreshTokenController,
  logoutController,
  resetPasswordController,
} from './auth.controller.js';

import { wrapAsync } from '../../utils/handlers.js';
import { verifyGoogleToken } from './auth.middlewares.js';
import { accessTokenValidator } from './auth.middlewares.js';
import { validate } from '../../middlewares/validate.middlewares.js';
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
} from '../../validations/auth.schema.js';

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register
 * @access Private (later)
 */
authRouter.post(
  '/register',
  validate(registerSchema),
  wrapAsync(registerController),
);

/**
 * @route POST /api/auth/login
 * @desc Login
 * @access Private (later)
 */
authRouter.post('/login', validate(loginSchema), wrapAsync(loginController));

/**
 * @route POST /api/auth/forgot-password
 * @desc Forgot password
 * @access Private (later)
 */
authRouter.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  wrapAsync(forgotPasswordController),
);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password when forgot password
 * @access Private (later)
 */
authRouter.post(
  '/reset-password',
  validate(resetPasswordSchema),
  wrapAsync(resetPasswordController),
);

/**
 * @route POST /api/auth/google
 * @desc Get product by ID
 * @access Private (later)
 */
authRouter.post('/google', verifyGoogleToken, wrapAsync(googleAuthController));

/**
 * @route POST /api/auth/refresh-token
 * @desc Get product by ID
 * @access Private (later)
 */
authRouter.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  wrapAsync(refreshTokenController),
);

/**
 * @route POST /api/auth/logout
 * @desc Get product by ID
 * @access Private (later)
 */
authRouter.post('/logout', accessTokenValidator, wrapAsync(logoutController));

export default authRouter;
