import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  {
    versionKey: false,
  },
);

export default mongoose.model('Category', categorySchema);
