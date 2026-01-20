const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  phone: { type: String },
  is_active: { type: Boolean, default: true },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'roles' }, // Link to roles collection
  username: { type: String, required: true, unique: true }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

module.exports = mongoose.model('users', userSchema);