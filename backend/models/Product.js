const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  unit: { type: String },
  stock_quantity: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' }
}, { 
  versionKey: false,
  timestamps: true // Tự động tạo createdAt và updatedAt
});

module.exports = mongoose.model('products', productSchema);