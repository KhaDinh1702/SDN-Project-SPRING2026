import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import Role from './src/models/Role.js';
import User from './src/models/User.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
import ProductImage from './src/models/ProductImage.js';
import Order from './src/models/Order.js';
import OrderProduct from './src/models/OrderProduct.js';
import PaymentTransaction from './src/models/PaymentTransaction.js';
import StockTransaction from './src/models/StockTransaction.js';
import StockTransactionDetail from './src/models/StockTransactionDetail.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for full seeding...');

    // 1. Clear all existing data to start fresh
    await Promise.all([
      Role.deleteMany({}),
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      ProductImage.deleteMany({}),
      Order.deleteMany({}),
      OrderProduct.deleteMany({}),
      PaymentTransaction.deleteMany({}),
      StockTransaction.deleteMany({}),
      StockTransactionDetail.deleteMany({}),
    ]);

    // 2. Roles
    const roles = await Role.insertMany([
      { name: 'manager' },
      { name: 'staff' },
      { name: 'customer' },
      { name: 'admin' },
    ]);
    const adminRole = roles.find((r) => r.name === 'admin');
    const customerRole = roles.find((r) => r.name === 'customer');

    // 3. Users

    const hashedPassword = await bcrypt.hash('admin@123', 10);

    const admin = await User.create({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@freshmart.com',
      password_hash: hashedPassword,
      phone: '0123456789',
      is_active: true,
      role_id: adminRole._id,
      username: 'admin',
    });

    const customer = await User.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password_hash: 'secret',
      phone: '0987654321',
      is_active: true,
      role_id: customerRole._id,
      username: 'johndoe',
    });

    // 4. Categories
    const categories = await Category.insertMany([
      { name: 'Vegetables' },
      { name: 'Meat' },
    ]);
    const vegCat = categories.find((c) => c.name === 'Vegetables');

    // 5. Products
    const tomato = await Product.create({
      name: 'Organic Tomato',
      price: 3.5,
      unit: 'kg',
      stock_quantity: 100,
      is_active: true,
      category_id: vegCat._id,
    });

    // 6. Product Images
    await ProductImage.create({
      product_id: tomato._id,
      image_url: 'tomato.jpg',
    });

    // 7. Orders & Order Products
    const order = await Order.create({
      user_id: customer._id,
      total_amount: 7.0,
      order_status: 'Pending',
      payment_status: 'Unpaid',
    });

    await OrderProduct.create({
      order_id: order._id,
      product_id: tomato._id,
      quantity: 2,
      unit_price: 3.5,
      total_price: 7.0,
    });

    // 8. Payment Transaction
    await PaymentTransaction.create({
      order_id: order._id,
      amount: 7.0,
      transaction_code: 'TXN123456',
      payment_status: 'Pending',
    });

    // 9. Stock Transactions
    const stockTx = await StockTransaction.create({
      user_id: admin._id,
      total_price: 350.0,
      note: 'Initial Stock',
    });

    await StockTransactionDetail.create({
      stock_transaction_id: stockTx._id,
      product_id: tomato._id,
      type: 'In',
      quantity: 100,
      unit_price: 3.5,
      total_price: 350.0,
    });

    console.log(' All 10 collections seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(' Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
