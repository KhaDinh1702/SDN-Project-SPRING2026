const express = require('express');
const router = express.Router();
const { register, login, googleAuth, forgotPassword } = require('../controllers/authController');


// Test GET /auth
router.get('/', (req, res) => {
    res.json({ message: "Auth Module is connected!" });
});
// POST /auth/register -> delegate to controller
router.post('/register', register);
// POST /auth/login -> returns JWT on success
router.post('/login', login);
// POST /auth/google -> Google OAuth authentication
router.post('/google', googleAuth);
router.post("/forgot-password", forgotPassword);
module.exports = router;