import mongoose from 'mongoose';

const stockTransactionDetailSchema = new mongoose.Schema(
  {
    stock_transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StockTransaction',
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    type: { type: String, enum: ['In', 'Out'], required: true }, // As per In/Out note in diagram
    quantity: { type: Number, required: true },
    unit_price: { type: Number, required: true },
    total_price: { type: Number, required: true },
    create_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    collection: 'stock_transaction_details',
  },
);

export default mongoose.model(
  'StockTransactionDetail',
  stockTransactionDetailSchema,
);
