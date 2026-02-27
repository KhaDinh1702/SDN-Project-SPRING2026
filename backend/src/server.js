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
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      // added in Son branch – keep extra localhost port
      'http://localhost:5174',
    ],
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
app.listen(PORT, () =>
  console.log(` Server started on http://localhost:${PORT}`),
);
