import { Router } from 'express';
import {
    createDishController,
    deleteDishController,
    getAllDishesController,
    getDishByIdController,
    updateDishController,
} from './dish.controller.js';
import { requireAuth, requireRole } from '../auth/auth.middlewares.js';
import { validate } from '../../middlewares/validate.middlewares.js';
import upload from '../../utils/multer.js';
import {
    createDishSchema,
    updateDishSchema,
} from '../../validations/dish.schema.js';

const dishRouter = Router();

/**
 * @route GET /api/dishes
 * @desc Get all dishes
 */
dishRouter.get('/', getAllDishesController);

/**
 * @route GET /api/dishes/:id
 * @desc Get dish by ID
 */
dishRouter.get('/:id', getDishByIdController);

/**
 * @route POST /api/dishes
 * @desc Create new dish - MANAGER/STAFF only
 */
dishRouter.post(
    '/',
    requireAuth,
    requireRole(['admin', 'manager', 'staff']),
    upload.array('images', 5),
    validate(createDishSchema),
    createDishController,
);

/**
 * @route PUT /api/dishes/:id
 * @desc update dish by ID - MANAGER/STAFF only
 */
dishRouter.put(
    '/:id',
    requireAuth,
    requireRole(['admin', 'manager', 'staff']),
    upload.array('images', 5),
    validate(updateDishSchema),
    updateDishController,
);

/**
 * @route DELETE /api/dishes/:id
 * @desc Delete dish by ID - MANAGER/STAFF only
 */
dishRouter.delete(
    '/:id',
    requireAuth,
    requireRole(['admin', 'manager', 'staff']),
    deleteDishController,
);

export default dishRouter;
