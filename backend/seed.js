require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const Role = require('./models/Role');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const ProductImage = require('./models/ProductImage');
const Order = require('./models/Order');
const OrderProduct = require('./models/OrderProduct');
const PaymentTransaction = require('./models/PaymentTransaction');
const StockTransaction = require('./models/StockTransaction');
const StockTransactionDetail = require('./models/StockTransactionDetail');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for full seeding...");

    // 1. Clear all existing data to start fresh
    await Promise.all([
      Role.deleteMany({}), User.deleteMany({}), Category.deleteMany({}),
      Product.deleteMany({}), ProductImage.deleteMany({}), Order.deleteMany({}),
      OrderProduct.deleteMany({}), PaymentTransaction.deleteMany({}),
      StockTransaction.deleteMany({}), StockTransactionDetail.deleteMany({})
    ]);

    // 2. Roles
    const roles = await Role.insertMany([{ name: 'Manager' }, { name: 'Staff' }, { name: 'Customer' }]);
    const managerRole = roles.find(r => r.name === 'Manager');
    const customerRole = roles.find(r => r.name === 'Customer');

    // 3. Users
    const admin = await User.create({
      first_name: "Admin", last_name: "User", email: "admin@freshmart.com",
      password_hash: "secret", phone: "0123456789", is_active: true,
      role_id: managerRole._id, username: "admin"
    });

    const customer = await User.create({
      first_name: "John", last_name: "Doe", email: "john@example.com",
      password_hash: "secret", phone: "0987654321", is_active: true,
      role_id: customerRole._id, username: "johndoe"
    });

    // 4. Categories
    const categories = await Category.insertMany([{ name: 'Vegetables' }, { name: 'Meat' }]);
    const vegCat = categories.find(c => c.name === 'Vegetables');

    // 5. Products
    const tomato = await Product.create({
      name: "Organic Tomato", price: 3.50, unit: "kg", 
      stock_quantity: 100, is_active: true, category_id: vegCat._id
    });

    // 6. Product Images
    await ProductImage.create({ product_id: tomato._id, image_url: "tomato.jpg" });

    // 7. Orders & Order Products
    const order = await Order.create({
      user_id: customer._id, total_amount: 7.00, 
      order_status: "Pending", payment_status: "Unpaid"
    });

    await OrderProduct.create({
      order_id: order._id, product_id: tomato._id, 
      quantity: 2, unit_price: 3.50, total_price: 7.00
    });

    // 8. Payment Transaction
    await PaymentTransaction.create({
      order_id: order._id, amount: 7.00, 
      transaction_code: "TXN123456", payment_status: "Pending"
    });

    // 9. Stock Transactions
    const stockTx = await StockTransaction.create({
      user_id: admin._id, total_price: 350.00, note: "Initial Stock"
    });

    await StockTransactionDetail.create({
      stock_transaction_id: stockTx._id, product_id: tomato._id,
      type: "In", quantity: 100, unit_price: 3.50, total_price: 350.00
    });

    console.log(" All 10 collections seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(" Seeding failed:", err);
    process.exit(1);
  }
};

seedDatabase();