const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'orders', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  total_price: { type: Number, required: true } // quantity * unit_price
}, {
  versionKey: false
});

module.exports = mongoose.model('order_products', orderProductSchema);