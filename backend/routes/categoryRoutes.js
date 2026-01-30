const express = require('express');
const router = express.Router();

const { getAllCategories } = require('../controllers/categoryController');

router.get('/', getAllCategories);

module.exports = router;
