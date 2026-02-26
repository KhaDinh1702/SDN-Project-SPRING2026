import {
  createStockTransaction,
  getStockById,
  getStockHistory,
} from './stock.service.js';

export const createStockTransactionController = async (req, res) => {
  const result = await createStockTransaction(req.currentUser._id, req.body);

  res.status(201).json({
    success: true,
    data: result,
  });
};

export const getStockHistoryController = async (req, res) => {
  const result = await getStockHistory(req.query);

  const response = result.data.map((transaction) => ({
    id: transaction._id,
    type: transaction.type,
    totalPrice: transaction.total_price,
    note: transaction.note,
    createdAt: transaction.createdAt,
    user: transaction.user
      ? {
          id: transaction.user._id,
          email: transaction.user.email,
        }
      : null,
  }));

  res.json({
    success: true,
    data: response,
    pagination: result.pagination,
  });
};

export const getStockByIdController = async (req, res) => {
  const transaction = await getStockById(req.params.id);

  const response = {
    id: transaction._id,
    user: transaction.user
      ? {
          id: transaction.user._id,
          email: transaction.user.email,
        }
      : null,
    type: transaction.type,
    totalPrice: transaction.total_price,
    note: transaction.note,
    createdAt: transaction.createdAt,
    createdBy: transaction.user?.email,
    items: transaction.items.map((item) => ({
      productId: item.product._id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      totalPrice: item.total_price,
    })),
  };

  res.json({
    success: true,
    data: response,
  });
};
