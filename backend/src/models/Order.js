import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    total_amount: { type: Number, required: true },
    order_status: { type: String, default: 'Pending' },
    payment_status: { type: String, default: 'Unpaid' },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at' },
  },
);

export default mongoose.model('Order', orderSchema);
