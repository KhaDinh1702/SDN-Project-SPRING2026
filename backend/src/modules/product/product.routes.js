import { Router } from 'express';
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
} from './product.controller.js';
import { requireAuth, requireRole } from '../auth/auth.middlewares.js';
import { validate } from '../../middlewares/validate.middlewares.js';
import upload from '../../utils/multer.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../../validations/product.schema.js';

const productRouter = Router();

/**
 * @route GET /api/products
 * @desc Get all products
 */
productRouter.get('/', getAllProductsController);

/**
 * @route GET /api/products/:id
 * @desc Get product by ID
 */
productRouter.get('/:id', getProductByIdController);

/**
 * @route POST /api/products
 * @desc Create new product - ADMIN only
 */
productRouter.post(
  '/',
  requireAuth,
  requireRole(['admin', 'manager']),
  upload.array('images', 5),
  validate(createProductSchema),
  createProductController,
);

/**
 * @route PUT /api/products/:id
 * @desc update product by ID - ADMIN only
 */
productRouter.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'manager']),
  upload.array('images', 5),
  validate(updateProductSchema),
  updateProductController,
);

/**
 * @route DELETE /api/products/:id
 * @desc Delete product by ID - ADMIN only
 */
productRouter.delete(
  '/:id',
  requireAuth,
  requireRole(['admin', 'manager']),
  deleteProductController,
);

export default productRouter;
