import mongoose from 'mongoose';

const stockTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['IN', 'OUT'],
      required: true,
    },
    total_price: { type: Number, required: true, min: 0 },
    note: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'stock_transactions',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

stockTransactionSchema.virtual('items', {
  ref: 'StockTransactionDetail',
  localField: '_id',
  foreignField: 'stock_transaction',
});

export default mongoose.model('StockTransaction', stockTransactionSchema);
