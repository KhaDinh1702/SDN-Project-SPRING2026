const express = require('express');
const router = express.Router();
const { register } = require('../controllers/authController');


// Test GET /auth
router.get('/', (req, res) => {
    res.json({ message: "Auth Module is connected!" });
});
// Test Post /auth/register
router.post('/register', (req, res) => {
    res.json({ message: "Register endpoint reached" });
});

module.exports = router;