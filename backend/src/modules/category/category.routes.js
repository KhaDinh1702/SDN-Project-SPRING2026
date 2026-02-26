import express from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from './category.controller.js';
import { Router } from 'express';
import { requireAuth, requireRole } from '../auth/auth.middlewares.js';
import { wrapAsync } from '../../utils/handlers.js';

const categoryRouter = Router();

/**
 * @route GET /api/categories
 * @desc Get all categories
 */
categoryRouter.get('/', wrapAsync(getAllCategoriesController));

/**
 * @route GET /api/categories
 * @desc Get all categories
 */
categoryRouter.get('/:id', wrapAsync(getCategoryByIdController));

/**
 * @route GET /api/categories/:id
 * @desc Get category by id
 */
categoryRouter.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  wrapAsync(createCategoryController),
);

/**
 * @route PUT /api/categories/:id
 * @desc Update category by id
 */
categoryRouter.put(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  wrapAsync(updateCategoryController),
);

/**
 * @route DELETE /api/categories/:id
 * @desc Delete category by id
 */
categoryRouter.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  wrapAsync(deleteCategoryController),
);

export default categoryRouter;
