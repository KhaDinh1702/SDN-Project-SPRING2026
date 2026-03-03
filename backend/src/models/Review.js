import mongoose, { Schema, model } from 'mongoose';

const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    isAnonymous: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model('Review', reviewSchema);
