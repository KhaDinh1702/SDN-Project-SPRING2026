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

  stock_quantity: z.coerce
    .number({
      invalid_type_error: 'Stock quantity must be a number',
    })
    .min(0, 'Stock quantity must be greater than or equal to 0')
    .optional(),

  category_id: z.string().optional(),

  is_active: z.coerce
    .boolean({
      invalid_type_error: 'is_active must be boolean',
    })
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();
