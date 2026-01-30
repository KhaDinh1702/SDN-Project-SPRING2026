const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  phone: String,
  is_active: { type: Boolean, default: true },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'roles' },
  username: { type: String, required: true, unique: true }
}, { 
  versionKey: false, // Tắt trường __v
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // Tự động tạo ngày
});

module.exports = mongoose.model('users', userSchema);