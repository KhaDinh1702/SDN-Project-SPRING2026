const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  image_url: { type: String, required: true }
}, {
  versionKey: false
});

module.exports = mongoose.model('product_images', productImageSchema);