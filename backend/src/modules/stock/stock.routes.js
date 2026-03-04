import express from 'express';
import {
  createStockTransactionController,
  getStockByIdController,
  getStockHistoryController,
} from './stock.controller.js';
import {
  createStockSchema,
  getStockQuerySchema,
} from '../../validations/stock.schema.js';
import { requireAuth, requireRole } from '../auth/auth.middlewares.js';
import { validate } from '../../middlewares/validate.middlewares.js';
import { wrapAsync } from '../../utils/handlers.js';

const stockRouter = express.Router();

/**
 * @route POST /api/stock
 * @desc Create new stock transaction - ADMIN and MANAGER only
 */
stockRouter.post(
  '/',
  requireAuth,
  requireRole(['admin', 'manager']),
  validate(createStockSchema),
  wrapAsync(createStockTransactionController),
);

/**
 * @route GET /api/stock/:id
 * @desc Get stock transaction by ID - ADMIN and MANAGER only
 */
stockRouter.get(
  '/:id',
  requireAuth,
  requireRole(['admin', 'manager']),
  wrapAsync(getStockByIdController),
);

/**
 * @route GET /api/stock
 * @desc Get stock transaction history - ADMIN and MANAGER only
 */
stockRouter.get(
  '/',
  requireAuth,
  requireRole(['admin', 'manager']),
  validate(getStockQuerySchema, 'query'),
  wrapAsync(getStockHistoryController),
);
export default stockRouter;
