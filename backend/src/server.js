import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());

// Middleware
app.use(
  cors({
    origin: true, // cho phép mọi origin
    credentials: true,
  }),
);

app.use(json());

// Health Check Route
app.get('/', (req, res) => {
  res.send('FreshMart Backend is LIVE ');
});

// Mount Routes at the root level
app.use('/api', routes);

// Connect to Database
connectDB();

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () =>
  console.log(` Server started on http://0.0.0.0:${PORT}`),
);
