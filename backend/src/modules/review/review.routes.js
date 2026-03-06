import express from 'express';
import { requireAuth } from '../auth/auth.middlewares.js';
import * as reviewController from './review.controller.js';

const reviewRouter = express.Router();

reviewRouter.get('/product/:productId', reviewController.getReviewsByProduct);

reviewRouter.post('/', requireAuth, reviewController.createReview);

reviewRouter.delete('/:id', requireAuth, reviewController.deleteReview);

export default reviewRouter;
