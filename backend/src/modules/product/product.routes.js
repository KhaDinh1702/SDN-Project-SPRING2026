import { Router } from 'express';
import {
  getAllProductsController,
  getProductByIdController,
} from './product.controller.js';

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

export default productRouter;
