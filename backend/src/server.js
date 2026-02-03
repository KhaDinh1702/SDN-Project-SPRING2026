import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Import individual module routes
import authRouter from './modules/auth/auth.routes.js';
import productRouter from './modules/product/product.routes.js';
import categoryRouter from './modules/category/category.routes.js';
import stockRouter from './modules/stock/stock.routes.js';
import orderRouter from './modules/order/order.routes.js';
import paymentRouter from './modules/payment/payment.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Health Check Route
app.get('/', (req, res) => {
  res.send('FreshMart Backend is LIVE ');
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/stock', stockRouter);
app.use('/api/payment', paymentRouter);

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(` Server started on http://localhost:${PORT}`),
);
