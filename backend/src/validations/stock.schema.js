import { z } from 'zod';

export const createStockSchema = z.object({
  type: z.enum(['IN', 'OUT']),

  note: z.string().optional(),

  items: z
    .array(
      z.object({
        product_id: z.string(),
        unit_price: z.coerce.number().min(0),
        quantity: z.coerce.number().min(1),
      }),
    )
    .min(1),
});

export const getStockQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  type: z.enum(['IN', 'OUT']).optional(),

  start_date: z.string().optional(),
  end_date: z.string().optional(),
});
