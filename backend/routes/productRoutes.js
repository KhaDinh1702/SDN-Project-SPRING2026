const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

// Test GET /products
router.get('/', async (req, res) => {
   res.json({ message: "Product Module is connected!" });
});

module.exports = router;