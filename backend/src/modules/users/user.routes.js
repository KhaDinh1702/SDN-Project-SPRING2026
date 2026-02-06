import { Router } from 'express';
import {
  accessTokenValidator,
  requireAuth,
  requireRole,
} from '../auth/auth.middlewares.js';
import {
  createUserController,
  setUserActiveStatusController,
  updateMyProfileController,
} from './user.controller.js';
import { createUserSchema } from '../../validations/user.schema.js';
import { validate } from '../../middlewares/validate.middlewares.js';
import { wrapAsync } from '../../utils/handlers.js';

const userRouter = Router();

/**
 * @route POST /api/users
 * @desc Create new account for employee - ADMIN only
 * @access Private (later)
 */
userRouter.post(
  '/',
  validate(createUserSchema),
  accessTokenValidator,
  requireRole(['admin']),
  createUserController,
);

/**
 * @route PATCH /api/users/:id/ban
 * @desc Ban User - ADMIN only
 * @access Private (later)
 */
userRouter.patch(
  '/:id/ban',
  accessTokenValidator,
  requireRole(['admin']),
  wrapAsync(setUserActiveStatusController),
);

/**
 * @route PUT /api/users/me
 * @desc Update  MyProfile, 
 * @access Private (later)
 */
userRouter.put('/me', requireAuth, wrapAsync(updateMyProfileController));

export default userRouter;
