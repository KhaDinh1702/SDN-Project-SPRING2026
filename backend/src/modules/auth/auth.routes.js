import express from 'express';
import {
  register,
  login,
  googleAuth,
  forgotPassword,
} from './auth.controller.js';
import { Router } from 'express';

const authRouter = Router();

// Test GET /auth
authRouter.get('/', (req, res) => {
  res.json({ message: 'Auth Module is connected!' });
});
// POST /auth/register -> delegate to controller
authRouter.post('/register', register);
// POST /auth/login -> returns JWT on success
authRouter.post('/login', login);
// POST /auth/google -> Google OAuth authentication
authRouter.post('/google', googleAuth);
authRouter.post('/forgot-password', forgotPassword);

export default authRouter;
