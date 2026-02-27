import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import Role from './src/models/Role.js';
import User from './src/models/User.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
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
  { name: 'Fish' },
  { name: 'Meat' },
  { name: 'Vegetables' },
  { name: 'Spices' },
  { name: 'Fruits' },
]);

const getCategoryId = (name) =>
  categories.find((c) => c.name === name)._id;

// 5. Products
const productsData = [
  // 🐟 Fish
  {
    name: 'Norwegian Salmon',
    price: 22,
    unit: 'kg',
    category: 'Fish',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhJiwO6G8LKIVPH92P155Ec0yK5i1_p_4PXA&s', publicId: 'salmon_1', isPrimary: true }]
  },
  {
    name: 'Basa Fillet',
    price: 9,
    unit: 'kg',
    category: 'Fish',
    images: [{ url: 'https://static.wixstatic.com/media/5eb9e1_f4f94207d34f4806b9920133250630bf~mv2.jpg/v1/fill/w_480,h_478,al_c,lg_1,q_80,enc_avif,quality_auto/5eb9e1_f4f94207d34f4806b9920133250630bf~mv2.jpg', publicId: 'basa_1', isPrimary: true }]
  },
  {
    name: 'Mackerel',
    price: 16,
    unit: 'kg',
    category: 'Fish',
    images: [{ url: 'https://nantucket-current.nyc3.cdn.digitaloceanspaces.com/assets/imager/mainuploads/404608/UTF-81-Mackerel_40753240154b642b79a8b14aaf2a86eb.jpg', publicId: 'mackerel_1', isPrimary: true }]
  },
  {
    name: 'Red Tilapia',
    price: 7.5,
    unit: 'kg',
    category: 'Fish',
    images: [{ url: 'https://vietnamfishes.com/wp-content/uploads/2019/03/Red-Tilapia.jpg', publicId: 'tilapia_1', isPrimary: true }]
  },
  {
    name: 'Snakehead Fish',
    price: 12,
    unit: 'kg',
    category: 'Fish',
    images: [{ url: 'https://blog.nature.org/wp-content/uploads/2025/02/original.jpg?w=1024', publicId: 'snakehead_1', isPrimary: true }]
  },
  {
    name: 'Scad Fish',
    price: 6.5,
    unit: 'kg',
    category: 'Fish',
    images: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Finny_scad.JPG', publicId: 'scad_1', isPrimary: true }]
  },

  // 🥩 Meat
  {
    name: 'Pork Belly',
    price: 15,
    unit: 'kg',
    category: 'Meat',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROFs4Q3c6-lAFAevGgn1Ytps_9v1pB11-ebA&s', publicId: 'porkbelly_1', isPrimary: true }]
  },
  {
    name: 'Pork Ribs',
    price: 18,
    unit: 'kg',
    category: 'Meat',
    images: [{ url: 'https://5.imimg.com/data5/VW/SX/DL/ANDROID-50103244/prod-20200404-2259145772696274866343732-jpg-500x500.jpg', publicId: 'porkribs_1', isPrimary: true }]
  },
  {
    name: 'Australian Beef',
    price: 32,
    unit: 'kg',
    category: 'Meat',
    images: [{ url: 'https://www.aussiebeefandlamb.co.uk/contentassets/db6d7ec044a14f2ca46276199e0c1e23/home-page-header-banner.jpg', publicId: 'beef_1', isPrimary: true }]
  },
  {
    name: 'Chicken Breast',
    price: 11,
    unit: 'kg',
    category: 'Meat',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsatbFzK_dfKtqQ3G9HvUR_DBdCfHmkOagug&s', publicId: 'chickenbreast_1', isPrimary: true }]
  },
  {
    name: 'Chicken Drumsticks',
    price: 9.5,
    unit: 'kg',
    category: 'Meat',
    images: [{ url: 'https://primecutny.com/cdn/shop/files/DrumsticksFamilyPack.jpg?v=1740423079', publicId: 'drumsticks_1', isPrimary: true }]
  },
  {
    name: 'Pork Shoulder',
    price: 14.5,
    unit: 'kg',
    category: 'Meat',
    images: [{ url: 'https://www.ginginbeef.com/wp-content/uploads/2019/09/porkshoulder.webp', publicId: 'porkshoulder_1', isPrimary: true }]
  },

  // 🥬 Vegetables
  {
    name: 'Organic Tomato',
    price: 3.5,
    unit: 'kg',
    category: 'Vegetables',
    images: [{ url: 'https://attra.ncat.org/wp-content/uploads/2022/04/tomato.jpg', publicId: 'tomato_1', isPrimary: true }]
  },
  {
    name: 'Carrot',
    price: 2.2,
    unit: 'kg',
    category: 'Vegetables',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRThwdpK3SufSguubRNkk3v9Yp8tbPRzUO3rg&s', publicId: 'carrot_1', isPrimary: true }]
  },
  {
    name: 'Cabbage',
    price: 1.8,
    unit: 'kg',
    category: 'Vegetables',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1nHmlJ9yvJ6zJQxSsvn5sGAhTQvQnehG64g&s', publicId: 'cabbage_1', isPrimary: true }]
  },
  {
    name: 'Potato',
    price: 2.5,
    unit: 'kg',
    category: 'Vegetables',
    images: [{ url: 'https://images.ctfassets.net/0dkgxhks0leg/RKiZ605RAV8kjDQnxFCWP/b03b8729817c90b29b88d536bfd37ac5/9-Unusual-Uses-For-Potatoes.jpg', publicId: 'potato_1', isPrimary: true }]
  },
  {
    name: 'Cucumber',
    price: 2.0,
    unit: 'kg',
    category: 'Vegetables',
    images: [{ url: 'https://natureandnurtureseeds.com/cdn/shop/files/Green-Finger-Cucumber-seeds_600x.jpg?v=1739910912', publicId: 'cucumber_1', isPrimary: true }]
  },
  {
    name: 'Spinach',
    price: 1.5,
    unit: 'kg',
    category: 'Vegetables',
    images: [{ url: 'https://www.gettystewart.com/wp-content/uploads/2014/01/spinach-fresh-in-bowl-sq.jpg', publicId: 'spinach_1', isPrimary: true }]
  },

  // 🌶 Spices
  {
    name: 'Garlic',
    price: 8.5,
    unit: 'kg',
    category: 'Spices',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYXgFXOIhyfVoX7lZVxhxrgAG68R3JIogDIg&s', publicId: 'garlic_1', isPrimary: true }]
  },
  {
    name: 'Shallot',
    price: 4.5,
    unit: 'kg',
    category: 'Spices',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToUa_HtBFrykuUsQlQBJv0qeK3Sx5d28Q1aQ&s', publicId: 'shallot_1', isPrimary: true }]
  },
  {
    name: 'Chili Pepper',
    price: 4.0,
    unit: 'kg',
    category: 'Spices',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ_4umd4OJZ_nHTxncwbRlXBvNtc2GpFBVsg&s', publicId: 'chili_1', isPrimary: true }]
  },
  {
    name: 'Black Pepper',
    price: 9.5,
    unit: 'kg',
    category: 'Spices',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFrGrByi-nsE10wLJna1BETboVZM8Q6SM5hg&s', publicId: 'blackpepper_1', isPrimary: true }]
  },
  {
    name: 'Ginger',
    price: 3.0,
    unit: 'kg',
    category: 'Spices',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-79LWRzlfHS9ZQqhIEQv7ktUY-R2U_vBuQ&s', publicId: 'ginger_1', isPrimary: true }]
  },
  {
    name: 'Lemongrass',
    price: 2.0,
    unit: 'kg',
    category: 'Spices',
    images: [{ url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/10/Screen-Shot-2021-10-07-at-11.08.27-PM.png', publicId: 'lemongrass_1', isPrimary: true }]
  },

  // 🍎 Fruits
  {
    name: 'Mango',
    price: 5.5,
    unit: 'kg',
    category: 'Fruits',
    images: [{ url: 'https://statics.vinpearl.com/Vietnamese-mango-2_1702197210.jpg', publicId: 'mango_1', isPrimary: true }]
  },
  {
    name: 'Orange',
    price: 4.8,
    unit: 'kg',
    category: 'Fruits',
    images: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Ambersweet_oranges.jpg/1280px-Ambersweet_oranges.jpg', publicId: 'orange_1', isPrimary: true }]
  },
  {
    name: 'Apple',
    price: 7.5,
    unit: 'kg',
    category: 'Fruits',
    images: [{ url: 'https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/articles/health_tools/healing_foods_slideshow/1800ss_getty_rf_apples.jpg?resize=750px:*&output-quality=75', publicId: 'apple_1', isPrimary: true }]
  },
  {
    name: 'Dragon Fruit',
    price: 4.2,
    unit: 'kg',
    category: 'Fruits',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb67u_pysMwsbL6018_XyhcQo_XxfBc8fJfA&s', publicId: 'dragonfruit_1', isPrimary: true }]
  },
  {
    name: 'Watermelon',
    price: 3.0,
    unit: 'kg',
    category: 'Fruits',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCR2eBUKsjuLAl0oqz7YvkZJFU1C3znejG4g&s', publicId: 'watermelon_1', isPrimary: true }]
  },
  {
    name: 'Banana',
    price: 2.5,
    unit: 'kg',
    category: 'Fruits',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9EYaQHTYBuaCBi0Dmb2ijsHJaAp3LoxZqFQ&s', publicId: 'banana_1', isPrimary: true }]
  }
];
const createdProducts = await Product.insertMany(
  productsData.map((p) => ({
    ...p,
    category: getCategoryId(p.category),
  }))
);

// lấy 1 sản phẩm để dùng cho order phía dưới
const tomato = createdProducts.find((p) => p.name === 'Organic Tomato');

    // 7. Orders & Order Products
    const order = await Order.create({
      user_id: customer._id,
      total_amount: 7.0,
      order_status: 'Pending',
      payment_status: 'Unpaid',
      shipping_address: '123 Main St, City, Country',
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
      user: admin._id,
      type: 'IN',
      total_price: 350.0,
      note: 'Initial Stock',
    });

    // Tạo transaction detail
    await StockTransactionDetail.create({
      stock_transaction: stockTx._id,
      product: tomato._id,
      quantity: 100,
      unit_price: 3.5,
      total_price: 350.0,
    });

    //Update stock product
    await Product.findByIdAndUpdate(tomato._id, {
      $inc: { stock_quantity: 100 },
    });

    console.log(' All 10 collections seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(' Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
