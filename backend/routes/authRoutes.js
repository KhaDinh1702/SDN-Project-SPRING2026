const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');


// Test GET /auth
router.get('/', (req, res) => {
    res.json({ message: "Auth Module is connected!" });
});
// POST /auth/register -> delegate to controller
router.post('/register', register);
// POST /auth/login -> returns JWT on success
router.post('/login', login);

module.exports = router;