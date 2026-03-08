import mongoose from 'mongoose';
import { z } from 'zod';

const productsSchema = z.array(
    z.object({
        product: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: 'Invalid product id',
        }),
        quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    })
);

// Helper to preprocess JSON strings from FormData to objects
const preprocessProducts = (val) => {
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        } catch {
            return [];
        }
    }
    return val;
};

export const createDishSchema = z.object({
    name: z
        .string({
            required_error: 'Dish name is required',
        })
        .min(1, 'Dish name cannot be empty'),

    description: z.string().optional(),

    is_active: z.coerce.boolean().optional(),

    products: z.preprocess(preprocessProducts, productsSchema).optional(),
});

export const updateDishSchema = z
    .object({
        name: z
            .string({
                invalid_type_error: 'Dish name must be a string',
            })
            .min(1, 'Dish name cannot be empty')
            .optional(),

        description: z
            .string({
                invalid_type_error: 'Description must be a string',
            })
            .optional(),

        is_active: z.coerce
            .boolean({
                invalid_type_error: 'is_active must be boolean',
            })
            .optional(),

        products: z.preprocess(preprocessProducts, productsSchema).optional(),
    })
    .strict();
