import express from 'express';
import getAllCategories from './category.controller.js';
import { Router } from 'express';

const categoryRouter = Router();

/**
 * @route GET /api/categories
 * @desc Get all categories
 * @access Private (later)
 */
categoryRouter.get('/', getAllCategories);

export default categoryRouter;
