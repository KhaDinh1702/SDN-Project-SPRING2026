import { Router } from 'express';
import { getRoles } from './role.controller.js';
import { requireAuth, requireRole } from '../auth/auth.middlewares.js';

const roleRouter = Router();

/**
 * @route GET /api/roles
 * @desc get all role in Role model - ADMIN only
 * @access Private (later)
 */
roleRouter.get('/', requireAuth, requireRole(['admin']), getRoles);

export default roleRouter;
