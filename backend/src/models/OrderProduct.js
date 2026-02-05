import mongoose from 'mongoose';

const orderProductSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: { type: Number, required: true },
    unit_price: { type: Number, required: true },
    total_price: { type: Number, required: true }, // quantity * unit_price
  },
  {
    versionKey: false,
    collection: 'order_products',
  },
);

export default mongoose.model('OrderProduct', orderProductSchema);
