import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { 
  versionKey: false // Cấu hình này phải nằm ở đây
});

export default mongoose.model('Role', roleSchema);