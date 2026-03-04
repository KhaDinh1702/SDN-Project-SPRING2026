import mongoose from 'mongoose';
import StockTransaction from '../../models/StockTransaction.js';
import Product from '../../models/Product.js';
import StockTransactionDetail from '../../models/StockTransactionDetail.js';
import { paginate } from '../../utils/paginate.js';

const TRANSACTION_TYPES = {
  IN: 'IN',
  OUT: 'OUT',
};

const calculateTotalPrice = (items) =>
  items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

export const createStockTransaction = async (userId, payload) => {
  const { type, note, items } = payload;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Items cannot be empty');
  }

  if (!Object.values(TRANSACTION_TYPES).includes(type)) {
    throw new Error('Invalid transaction type');
  }

  for (const item of items) {
    if (!item.product_id) {
      throw new Error('Product ID is required');
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error('Quantity must be a positive integer');
    }

    if (typeof item.unit_price !== 'number' || item.unit_price < 0) {
      throw new Error('Unit price must be >= 0');
    }
  }

  // Gộp product trùng
  const mergedMap = new Map();
  for (const item of items) {
    if (!mergedMap.has(item.product_id)) {
      mergedMap.set(item.product_id, { ...item });
    } else {
      mergedMap.get(item.product_id).quantity += item.quantity;
    }
  }

  const normalizedItems = Array.from(mergedMap.values());
  const productIds = normalizedItems.map((item) => item.product_id);

  const products = await Product.find({
    _id: { $in: productIds },
  });

  if (products.length !== productIds.length) {
    throw new Error('One or more products not found');
  }

  const totalPrice = calculateTotalPrice(normalizedItems);

  // Tạo transaction
  const transaction = await StockTransaction.create({
    user: userId,
    type,
    total_price: totalPrice,
    note,
  });

  // Tạo detail
  const detailDocs = normalizedItems.map((item) => ({
    stock_transaction: transaction._id,
    product: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.quantity * item.unit_price,
  }));

  await StockTransactionDetail.insertMany(detailDocs);

  // Update stock
  const bulkOps = normalizedItems.map((item) => ({
    updateOne: {
      filter: {
        _id: item.product_id,
        ...(type === TRANSACTION_TYPES.OUT && {
          stock_quantity: { $gte: item.quantity }, // tránh âm kho
        }),
      },
      update: {
        $inc: {
          stock_quantity:
            type === TRANSACTION_TYPES.OUT ? -item.quantity : item.quantity,
        },
      },
    },
  }));

  const result = await Product.bulkWrite(bulkOps);

  if (
    type === TRANSACTION_TYPES.OUT &&
    result.modifiedCount !== normalizedItems.length
  ) {
    throw new Error('Not enough stock');
  }

  return await StockTransaction.findById(transaction._id)
    .populate({
      path: 'items',
      populate: {
        path: 'product',
        select: 'name price stock_quantity',
      },
    })
    .populate({ path: 'user', select: 'name email' })
    .lean();
};

export const getStockHistory = async (query) => {
  const { type, start_date, end_date } = query;

  const filter = {};

  if (type) {
    filter.type = type;
  }

  if (start_date || end_date) {
    filter.createdAt = {};

    if (start_date) {
      filter.createdAt.$gte = new Date(start_date);
    }

    if (end_date) {
      filter.createdAt.$lte = new Date(end_date);
    }
  }

  const paginated = await paginate(StockTransaction, filter, query, {
    select: 'type total_price note createdAt user',
    populate: [{ path: 'user', select: 'name email' }],
  });

  return paginated;
};

export const getStockById = async (id) => {
  const transaction = await StockTransaction.findById(id)
    .populate({
      path: 'items',
      populate: {
        path: 'product',
        select: 'name price stock_quantity',
      },
    })
    .populate({ path: 'user', select: 'name email' })
    .lean();

  if (!transaction) {
    throw new Error('Stock transaction not found');
  }

  return transaction;
};
