import mongoose from 'mongoose';

const stockTransactionDetailSchema = new mongoose.Schema(
  {
    stock_transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StockTransaction',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    unit_price: { type: Number, required: true, min: 0 },
    total_price: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'stock_transaction_details',
  },
);
stockTransactionDetailSchema.index({ stock_transaction: 1 });
stockTransactionDetailSchema.index({ product: 1 });

stockTransactionDetailSchema.index(
  { stock_transaction: 1, product: 1 },
  { unique: true },
);

export default mongoose.model(
  'StockTransactionDetail',
  stockTransactionDetailSchema,
);
