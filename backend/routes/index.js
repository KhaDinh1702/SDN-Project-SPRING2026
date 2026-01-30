const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const stockRoutes = require('./stockRoutes');
const categoryRoutes = require('./categoryRoutes');

router.use('/auth', authRoutes);         // Module 1
router.use('/products', productRoutes); // Module 2
router.use('/orders', orderRoutes);     // Module 3
router.use('/stock', stockRoutes);      // Module 4
router.use('/categories', categoryRoutes);

module.exports = router;