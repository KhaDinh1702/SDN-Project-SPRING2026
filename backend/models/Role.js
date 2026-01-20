const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { 
  versionKey: false // Cấu hình này phải nằm ở đây
});

module.exports = mongoose.model('roles', roleSchema);