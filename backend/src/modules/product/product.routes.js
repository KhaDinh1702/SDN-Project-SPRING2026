import { Router } from 'express';
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
} from './product.controller.js';
import { accessTokenValidator, requireRole } from '../auth/auth.middlewares.js';
import { createProductsSchema } from '../../validations/product.schema.js';
import { validate } from '../../middlewares/validate.middlewares.js';

const productRouter = Router();

/**
 * @route GET /api/products
 * @desc Get all products
 * @access Private (later)
 */
productRouter.get('/', getAllProductsController);

/**
 * @route GET /api/products/:id
 * @desc Get product by ID
 * @access Private (later)
 */
productRouter.get('/:id', getProductByIdController);

/**
 * @route POST /api/products
 * @desc Create new product - ADMIN only
 * @access Private (later)
 */
productRouter.post(
  '/',
  validate(createProductsSchema),
  accessTokenValidator,
  requireRole(['admin', 'manager']),
  createProductController,
);

/**
 * @route PUT /api/products/:id
 * @desc update product by ID - ADMIN only
 * @access Private (later)
 */
productRouter.put(
  '/:id',
  accessTokenValidator,
  requireRole(['admin', 'manager']),
  updateProductController,
);

/**
 * @route DELETE /api/products/:id
 * @desc Delete product by ID - ADMIN only
 * @access Private (later)
 */
productRouter.delete(
  '/:id',
  accessTokenValidator,
  requireRole(['admin', 'manager']),
  deleteProductController,
);

export default productRouter;
