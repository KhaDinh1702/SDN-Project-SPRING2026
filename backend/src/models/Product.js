import { Schema, model } from 'mongoose';
import './Category.js';

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    origin: { type: String },
    expiry_date: { type: Date },
    weight: { type: Number },
    unit: { type: String },
    stock_quantity: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
  },
  {
    versionKey: false,
    timestamps: true, // Tự động tạo createdAt và updatedAt
  },
);

export default model('Product', productSchema);
