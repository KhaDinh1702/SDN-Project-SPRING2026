import mongoose, { Schema, model } from 'mongoose';
import './Category.js';

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false },
);

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
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    images: [ImageSchema],
  },
  {
    versionKey: false,
    timestamps: true, // Tự động tạo createdAt và updatedAt
  },
);

export default model('Product', productSchema);
