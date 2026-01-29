const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'orders', required: true },
  method: { type: String, default: 'Bank Transfer' },
  amount: { type: Number, required: true },
  payment_status: { type: String, default: 'Pending' },
  transaction_code: { type: String, unique: true }
}, { 
  versionKey: false,
  timestamps: { createdAt: 'created_at' } 
});

module.exports = mongoose.model('payment_transactions', transactionSchema);