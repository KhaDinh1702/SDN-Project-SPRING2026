import { Router } from 'express';
import { requireAuth, requireRole } from '../auth/auth.middlewares.js';
import {
  createUserController,
  getAllUsersController,
  getMyProfileController,
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
  requireAuth,
  requireRole(['admin']),
  wrapAsync(createUserController),
);

/**
 * @route PATCH /api/users/:id/ban
 * @desc Ban User - ADMIN only
 * @access Private (later)
 */
userRouter.patch(
  '/:id/ban',
  requireAuth,
  requireRole(['admin']),
  wrapAsync(setUserActiveStatusController),
);
/**
 * @route GET /api/users/me
 * @desc Get MyProfile,
 * @access Private (later)
 */
userRouter.get('/me', requireAuth, wrapAsync(getMyProfileController));

/**
 * @route PUT /api/users/me
 * @desc Update MyProfile,
 * @access Private (later)
 */
userRouter.put('/me', requireAuth, wrapAsync(updateMyProfileController));

/**
 * @route GET /api/users
 * @desc Get all users - ADMIN only
 * @access Private (later)
 */
userRouter.get(
  '/',
  requireAuth,
  requireRole(['admin']),
  wrapAsync(getAllUsersController),
);

export default userRouter;
