import { z } from 'zod';
import { USERS_MESSAGES } from '../constants/messages.js';

export const createProductSchema = z.object({
  name: z
    .string({
      required_error: USERS_MESSAGES.PRODUCT_REQUIRE,
    })
    .min(1, USERS_MESSAGES.PRODUCT_REQUIRE),

  price: z
    .number({
      required_error: USERS_MESSAGES.PRICE,
      invalid_type_error: USERS_MESSAGES.PRICE,
    })
    .min(0, USERS_MESSAGES.PRICE),

  description: z.string().optional(),

  origin: z.string().optional(),

  expiry_date: z.coerce
    .date({
      invalid_type_error: USERS_MESSAGES.PRODUCT_EXPIRY_DATE_INVALID,
    })
    .optional(),

  weight: z
    .number({
      invalid_type_error: 'Weight must be a number',
    })
    .min(0, 'Weight must be greater than or equal to 0')
    .optional(),

  unit: z.string().optional(),

  stock_quantity: z
    .number({
      invalid_type_error: USERS_MESSAGES.PRODUCT_STOCK_INVALID,
    })
    .min(0, USERS_MESSAGES.PRODUCT_STOCK_INVALID)
    .optional(),

  category_id: z.string().optional(),

  is_active: z
    .boolean({
      invalid_type_error: 'is_active must be boolean',
    })
    .optional(),
});

export const createProductsSchema = z
  .array(createProductSchema, {
    invalid_type_error: 'Body must be an array of products',
  })
  .min(1, 'Product list must not be empty');

export const updateProductSchema = createProductSchema.partial();
