import { z } from 'zod';

const emailSchema = z
  .string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  })
  .pipe(z.email('Email is invalid'));

export const createUserSchema = z.object({
  email: emailSchema,

  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),

  username: z
    .string({
      required_error: 'Username is required',
    })
    .min(3, 'Username must be at least 3 characters'),

  first_name: z
    .string({
      required_error: 'First name is required',
    })
    .min(1, 'First name is required'),

  last_name: z
    .string({
      required_error: 'Last name is required',
    })
    .min(1, 'Last name is required'),

  role: z.enum(['staff', 'manager'], {
    required_error: 'Role is required',
  }),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .optional(),

  first_name: z.string().min(1, 'First name is required').optional(),

  last_name: z.string().min(1, 'Last name is required').optional(),

  avatar: z
    .string({
      invalid_type_error: 'Avatar must be a string',
    })
    .url('Avatar must be a valid URL')
    .optional(),
});

export const changePasswordSchema = z.object({
  old_password: z
    .string({
      required_error: 'Old password is required',
    })
    .min(1, 'Old password is required'),

  new_password: z
    .string({
      required_error: 'New password is required',
    })
    .min(6, 'New password must be at least 6 characters'),
});
