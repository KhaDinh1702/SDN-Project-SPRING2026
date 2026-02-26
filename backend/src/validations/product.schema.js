import mongoose from 'mongoose';
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string({
      required_error: 'Product name is required',
    })
    .min(1, 'Product name cannot be empty'),

  price: z.coerce
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .min(0, 'Price must be greater than or equal to 0'),

  description: z.string().optional(),

  origin: z.string().optional(),

  expiry_date: z.coerce
    .date({
      invalid_type_error: 'Expiry date is invalid',
    })
    .optional(),

  weight: z.coerce
    .number({
      invalid_type_error: 'Weight must be a number',
    })
    .min(0, 'Weight must be greater than or equal to 0')
    .optional(),

  unit: z.string().optional(),

  category: z
    .string({
      invalid_type_error: 'Category ID must be a string',
    })
    .min(1, 'Category ID cannot be empty')
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid category id',
    })
    .optional(),
});

export const updateProductSchema = z
  .object({
    name: z
      .string({
        invalid_type_error: 'Product name must be a string',
      })
      .min(1, 'Product name cannot be empty')
      .optional(),

    price: z.coerce
      .number({
        invalid_type_error: 'Price must be a number',
      })
      .min(0, 'Price must be greater than or equal to 0')
      .optional(),

    description: z
      .string({
        invalid_type_error: 'Description must be a string',
      })
      .optional(),

    origin: z
      .string({
        invalid_type_error: 'Origin must be a string',
      })
      .optional(),

    expiry_date: z.coerce
      .date({
        invalid_type_error: 'Expiry date is invalid',
      })
      .optional(),

    weight: z.coerce
      .number({
        invalid_type_error: 'Weight must be a number',
      })
      .min(0, 'Weight must be greater than or equal to 0')
      .optional(),

    unit: z
      .string({
        invalid_type_error: 'Unit must be a string',
      })
      .optional(),

    category: z
      .string({
        invalid_type_error: 'Category ID must be a string',
      })
      .min(1, 'Category ID cannot be empty')
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid category id',
      })
      .optional(),

    is_active: z.coerce
      .boolean({
        invalid_type_error: 'is_active must be boolean',
      })
      .optional(),
  })
  .strict();
