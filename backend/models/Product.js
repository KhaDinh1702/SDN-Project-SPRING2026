
const mongoose = require('mongoose');
require('./Category');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  origin: { type: String },
  expiry_date: { type: Date },
  weight: { type: Number },
  unit: { type: String },
  stock_quantity: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' }
}, { 
  versionKey: false,
  timestamps: true // Tự động tạo createdAt và updatedAt
});

module.exports = mongoose.model('products', productSchema);