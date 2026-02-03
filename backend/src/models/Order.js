import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  total_amount: { type: Number, required: true },
  order_status: { type: String, default: 'Pending' },
  payment_status: { type: String, default: 'Unpaid' },
  payment_method: { type: String, required: true, default: 'COD' },
  shipping_address: { type: String, required: true }
}, {
  versionKey: false,
  timestamps: { createdAt: 'created_at' }
});

export default mongoose.model('orders', orderSchema);