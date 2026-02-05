import { z } from 'zod';
import { USERS_MESSAGES } from '../constants/messages.js';

export const registerSchema = z.object({
  email: z.email(USERS_MESSAGES.EMAIL_IS_REQUIRED),

  password: z.string().min(6, 'Password must be at least 6 characters'),

  username: z.string().min(3, 'Username must be at least 3 characters'),

  first_name: z.string().min(1, 'First name is required'),

  last_name: z.string().min(1, 'Last name is required'),
});

export const loginSchema = z.object({
  email: z.email(USERS_MESSAGES.EMAIL_IS_REQUIRED),

  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED),
});

export const forgotPasswordSchema = z.object({
  email: z.email(USERS_MESSAGES.EMAIL_IS_REQUIRED),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  forgot_password_token: z
    .string()
    .min(1, USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED),
});
