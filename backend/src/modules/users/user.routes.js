import { Router } from 'express';
import { accessTokenValidator, requireRole } from '../auth/auth.middlewares.js';
import { createUser } from './user.controller.js';
import { createUserSchema } from '../../validations/user.schema.js';
import { validate } from '../../middlewares/validate.middlewares.js';

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
  createUser,
);

export default userRouter;
