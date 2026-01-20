require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors()); // Allows your React frontend to talk to this API
app.use(express.json()); // Allows the server to read JSON data

// Connect to Database
connectDB();

// Basic Test Route
app.get('/', (req, res) => res.send('FreshMart API is running...'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server started on http://localhost:${PORT}`));