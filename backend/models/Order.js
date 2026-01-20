const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  total_amount: { type: Number, required: true },
  order_status: { type: String, default: 'Pending' },
  payment_status: { type: String, default: 'Unpaid' }
}, { 
  versionKey: false,
  timestamps: { createdAt: 'created_at' } 
});

module.exports = mongoose.model('orders', orderSchema);