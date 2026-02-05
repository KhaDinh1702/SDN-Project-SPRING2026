import mongoose from 'mongoose';

const { Schema } = mongoose;

const refreshTokenSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expires_at: {
      type: Date,
      required: true,
    },

    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    collection: 'refresh_tokens',
  },
);

// Optional: auto delete expired refresh tokens (TTL index)
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
