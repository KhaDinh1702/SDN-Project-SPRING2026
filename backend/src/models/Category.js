import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Đóng ngoặc nhọn ở đây
  },
  {
    versionKey: false, // Tùy chọn nằm trong Object thứ hai
  },
);

export default mongoose.model('Category', categorySchema);
