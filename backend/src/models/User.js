import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: {
      type: String,
      required: function () {
        return !this.google_id;
      },
    },
    phone: String,
    is_active: { type: Boolean, default: true },
    avatar_url: { type: String },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    username: { type: String, required: true, unique: true },
    google_id: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export default mongoose.model('User', userSchema);
