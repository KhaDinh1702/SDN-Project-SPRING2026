import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    image_url: { type: String, required: true },
  },
  {
    versionKey: false,
    collection: 'product_images',
  },
);

export default mongoose.model('ProductImage', productImageSchema);
