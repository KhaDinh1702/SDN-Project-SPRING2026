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

// Helper to correctly parse boolean strings from FormData.
// z.coerce.boolean() uses Boolean() which treats "false" as true (non-empty string).
const preprocessBoolean = (val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
};

export const createDishSchema = z.object({
    name: z
        .string({
            required_error: 'Dish name is required',
        })
        .min(1, 'Dish name cannot be empty'),

    description: z.string().optional(),

    is_active: z.preprocess(preprocessBoolean, z.boolean()).optional(),

    is_vegetarian: z.preprocess(preprocessBoolean, z.boolean()).optional(),

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

        is_active: z.preprocess(preprocessBoolean, z.boolean()).optional(),

        is_vegetarian: z.preprocess(preprocessBoolean, z.boolean()).optional(),

        products: z.preprocess(preprocessProducts, productsSchema).optional(),
    })
    .strict();

