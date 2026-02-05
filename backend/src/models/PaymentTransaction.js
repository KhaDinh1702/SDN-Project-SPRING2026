import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    method: { type: String, default: 'Bank Transfer' },
    amount: { type: Number, required: true },
    payment_status: { type: String, default: 'Pending' },
    transaction_code: { type: String, unique: true },
    // VNPay specific fields
    vnpay_response_code: { type: String },
    vnpay_transaction_no: { type: String },
    bank_code: { type: String },
    card_type: { type: String },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at' },
    collection: 'payment_transactions',
  },
);
export default mongoose.model('PaymentTransaction', transactionSchema);
