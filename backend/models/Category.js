const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true } // Đóng ngoặc nhọn ở đây
}, { 
  versionKey: false // Tùy chọn nằm trong Object thứ hai
});

module.exports = mongoose.model('Categories', categorySchema);