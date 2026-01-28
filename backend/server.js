require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes/index'); // Imports your main router

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Health Check Route
app.get('/', (req, res) => {
    res.send('FreshMart Backend is LIVE ');
});

// 2. Mount Routes at the root level 
app.use('/api', routes); 

// 3. Connect to Database
connectDB();

const PORT = process.env.PORT || 5001; 
app.listen(PORT, () => console.log(` Server started on http://localhost:${PORT}`));