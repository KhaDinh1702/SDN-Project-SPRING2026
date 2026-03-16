import mongoose, { Schema, model } from 'mongoose';
import './Product.js';

const ImageSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
    },
    { _id: false },
);

const DishProductSchema = new mongoose.Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
    },
    { _id: false },
);

const dishSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        is_active: { type: Boolean, default: true },
        is_vegetarian: { type: Boolean, default: false },
        images: [ImageSchema],
        products: [DishProductSchema],
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

export default model('Dish', dishSchema);
