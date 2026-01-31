import mongoose from 'mongoose';

const stockTransactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  created_at: { type: Date, default: Date.now },
  total_price: { type: Number, required: true },
  note: { type: String }
}, {
  versionKey: false
});

export default mongoose.model('stock_transactions', stockTransactionSchema);