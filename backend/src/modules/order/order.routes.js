import { Router } from 'express';
import createOrder from './order.controller.js';
import express from 'express';

const orderRouter = Router();

/**
 * @route POST /api/orders
 * @desc Create a new order
 * @access Private (later)
 */
orderRouter.post('/', createOrder);

export default orderRouter;
