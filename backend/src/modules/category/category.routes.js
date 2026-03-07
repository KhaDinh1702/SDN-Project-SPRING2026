import { Router } from 'express';
import multer from 'multer';
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from './category.controller.js';
import { requireAuth, requireRole } from '../auth/auth.middlewares.js';
import { wrapAsync } from '../../utils/handlers.js';

const categoryRouter = Router();
// multer: store file in memory so storage.service.js can upload it to R2
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route GET /api/categories
 * @desc Get all categories
 */
categoryRouter.get('/', wrapAsync(getAllCategoriesController));

/**
 * @route GET /api/categories/:id
 * @desc Get category by id
 */
categoryRouter.get('/:id', wrapAsync(getCategoryByIdController));

/**
 * @route POST /api/categories
 * @desc Create a new category (admin only)
 *       Accepts multipart/form-data (file upload) or application/json (URL)
 */
categoryRouter.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  upload.single('image'),
  wrapAsync(createCategoryController),
);

/**
 * @route PUT /api/categories/:id
 * @desc Update category by id (admin only)
 *       Accepts multipart/form-data (file upload) or application/json (URL)
 */
categoryRouter.put(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  upload.single('image'),
  wrapAsync(updateCategoryController),
);

/**
 * @route DELETE /api/categories/:id
 * @desc Delete category by id (admin only)
 */
categoryRouter.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  wrapAsync(deleteCategoryController),
);

export default categoryRouter;
