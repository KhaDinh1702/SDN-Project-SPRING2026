import express from 'express';
import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes.js';
import productRouter from '../modules/product/product.routes.js';
import categoryRouter from '../modules/category/category.routes.js';
import stockRouter from '../modules/stock/stock.routes.js';
import orderRouter from '../modules/order/order.routes.js';
const router = Router();

/**=========== AUTH ===========**/
router.use('/auth', authRouter);

/**=========== PRODUCT ===========**/
router.use('/products', productRouter);

/**=========== CATEGORY ===========**/
router.use('/categories', categoryRouter);

/**=========== ORDER ===========**/
router.use('/orders', orderRouter);

/**=========== STOCK ===========**/
router.use('/stock', stockRouter);

export default router;
