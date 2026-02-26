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

stockRouter.post(
  '/',
  requireAuth,
  requireRole(['admin', 'manager']),
  validate(createStockSchema),
  wrapAsync(createStockTransactionController),
);

stockRouter.get(
  '/:id',
  requireAuth,
  requireRole(['admin', 'manager']),
  wrapAsync(getStockByIdController),
);

stockRouter.get(
  '/',
  requireAuth,
  requireRole(['admin', 'manager']),
  validate(getStockQuerySchema, 'query'),
  wrapAsync(getStockHistoryController),
);
export default stockRouter;
