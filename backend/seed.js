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
        name: 'Cá Hồi Na Uy - Norwegian Salmon',
        price: 550000,
        weight: 1,
        unit: 'kg',
        category: 'Fish',
        images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhJiwO6G8LKIVPH92P155Ec0yK5i1_p_4PXA&s', publicId: 'salmon_1', isPrimary: true }]
      },
      {
        name: 'Phi Lê Cá Basa - Basa Fillet',
        price: 90000,
        weight: 500,
        unit: 'g',
        category: 'Fish',
        images: [{ url: 'https://static.wixstatic.com/media/5eb9e1_f4f94207d34f4806b9920133250630bf~mv2.jpg/v1/fill/w_480,h_478,al_c,lg_1,q_80,enc_avif,quality_auto/5eb9e1_f4f94207d34f4806b9920133250630bf~mv2.jpg', publicId: 'basa_1', isPrimary: true }]
      },
      {
        name: 'Cá Thu - Mackerel',
        price: 240000,
        weight: 1,
        unit: 'kg',
        category: 'Fish',
        images: [{ url: 'https://nantucket-current.nyc3.cdn.digitaloceanspaces.com/assets/imager/mainuploads/404608/UTF-81-Mackerel_40753240154b642b79a8b14aaf2a86eb.jpg', publicId: 'mackerel_1', isPrimary: true }]
      },
      {
        name: 'Cá Diêu Hồng - Red Tilapia',
        price: 85000,
        weight: 1,
        unit: 'kg',
        category: 'Fish',
        images: [{ url: 'https://vietnamfishes.com/wp-content/uploads/2019/03/Red-Tilapia.jpg', publicId: 'tilapia_1', isPrimary: true }]
      },
      {
        name: 'Cá Lóc Đồng - Snakehead Fish',
        price: 130000,
        weight: 1,
        unit: 'kg',
        category: 'Fish',
        images: [{ url: 'https://blog.nature.org/wp-content/uploads/2025/02/original.jpg?w=1024', publicId: 'snakehead_1', isPrimary: true }]
      },
      {
        name: 'Cá Nục Nguyên Con - Scad Fish',
        price: 65000,
        weight: 1,
        unit: 'kg',
        category: 'Fish',
        images: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Finny_scad.JPG', publicId: 'scad_1', isPrimary: true }]
      },

      // 🥩 Meat
      {
        name: 'Thịt Ba Chỉ Heo - Pork Belly',
        price: 160000,
        weight: 1,
        unit: 'kg',
        category: 'Meat',
        images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROFs4Q3c6-lAFAevGgn1Ytps_9v1pB11-ebA&s', publicId: 'porkbelly_1', isPrimary: true }]
      },
      {
        name: 'Sườn Non Heo - Pork Ribs',
        price: 190000,
        weight: 1,
        unit: 'kg',
        category: 'Meat',
        images: [{ url: 'https://5.imimg.com/data5/VW/SX/DL/ANDROID-50103244/prod-20200404-2259145772696274866343732-jpg-500x500.jpg', publicId: 'porkribs_1', isPrimary: true }]
      },
      {
        name: 'Thịt Bò Úc Nhập Khẩu - Australian Beef',
        price: 320000,
        weight: 1,
        unit: 'kg',
        category: 'Meat',
        images: [{ url: 'https://www.aussiebeefandlamb.co.uk/contentassets/db6d7ec044a14f2ca46276199e0c1e23/home-page-header-banner.jpg', publicId: 'beef_1', isPrimary: true }]
      },
      {
        name: 'Ức Gà Ta - Chicken Breast',
        price: 85000,
        weight: 500,
        unit: 'g',
        category: 'Meat',
        images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsatbFzK_dfKtqQ3G9HvUR_DBdCfHmkOagug&s', publicId: 'chickenbreast_1', isPrimary: true }]
      },
      {
        name: 'Đùi Gà Tỏi - Chicken Drumsticks',
        price: 75000,
        weight: 500,
        unit: 'g',
        category: 'Meat',
        images: [{ url: 'https://primecutny.com/cdn/shop/files/DrumsticksFamilyPack.jpg?v=1740423079', publicId: 'drumsticks_1', isPrimary: true }]
      },
      {
        name: 'Thịt Nạc Vai Heo - Pork Shoulder',
        price: 140000,
        weight: 1,
        unit: 'kg',
        category: 'Meat',
        images: [{ url: 'https://www.ginginbeef.com/wp-content/uploads/2019/09/porkshoulder.webp', publicId: 'porkshoulder_1', isPrimary: true }]
      },

      // 🥬 Vegetables
      {
        name: 'Cà Chua Hữu Cơ - Organic Tomato',
        price: 35000,
        weight: 500,
        unit: 'g',
        category: 'Vegetables',
        images: [{ url: 'https://attra.ncat.org/wp-content/uploads/2022/04/tomato.jpg', publicId: 'tomato_1', isPrimary: true }]
      },
      {
        name: 'Cà Rốt Đà Lạt - Carrot',
        price: 25000,
        weight: 500,
        unit: 'g',
        category: 'Vegetables',
        images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRThwdpK3SufSguubRNkk3v9Yp8tbPRzUO3rg&s', publicId: 'carrot_1', isPrimary: true }]
      },
      {
        name: 'Bắp Cải Trắng - Cabbage',
        price: 20000,
        weight: 1,
        unit: 'kg',
        category: 'Vegetables',
        images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1nHmlJ9yvJ6zJQxSsvn5sGAhTQvQnehG64g&s', publicId: 'cabbage_1', isPrimary: true }]
      },
      {
        name: 'Khoai Tây Đà Lạt - Potato',
        price: 30000,
        weight: 1,
        unit: 'kg',
        category: 'Vegetables',
        images: [{ url: 'https://images.ctfassets.net/0dkgxhks0leg/RKiZ605RAV8kjDQnxFCWP/b03b8729817c90b29b88d536bfd37ac5/9-Unusual-Uses-For-Potatoes.jpg', publicId: 'potato_1', isPrimary: true }]
      },
      {
        name: 'Dưa Leo Hữu Cơ - Cucumber',
        price: 22000,
        weight: 500,
        unit: 'g',
        category: 'Vegetables',
        images: [{ url: 'https://natureandnurtureseeds.com/cdn/shop/files/Green-Finger-Cucumber-seeds_600x.jpg?v=1739910912', publicId: 'cucumber_1', isPrimary: true }]
      },
      {
        name: 'Cải Bó Xôi - Spinach',
        price: 45000,
        weight: 500,
        unit: 'g',
        category: 'Vegetables',
        images: [{ url: 'https://www.gettystewart.com/wp-content/uploads/2014/01/spinach-fresh-in-bowl-sq.jpg', publicId: 'spinach_1', isPrimary: true }]
      },

      // 🌶 Spices
      {
        name: 'Tỏi Bắc Lý Sơn - Garlic',
        price: 120000,
        weight: 500,
        unit: 'g',
        category: 'Spices',
        images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYXgFXOIhyfVoX7lZVxhxrgAG68R3JIogDIg&s', publicId: 'garlic_1', isPrimary: true }]
      },
      {
        name: 'Hành Tím Vĩnh Châu - Shallot',
        price: 40000,
        weight: 500,
        unit: 'g',
        category: 'Spices',
        images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToUa_HtBFrykuUsQlQBJv0qeK3Sx5d28Q1aQ&s', publicId: 'shallot_1', isPrimary: true }]
      },
      {
        name: 'Ớt Chỉ Thiên - Chili Pepper',
        price: 15000,
        weight: 200,
        unit: 'g',
        category: 'Spices',
        images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ_4umd4OJZ_nHTxncwbRlXBvNtc2GpFBVsg&s', publicId: 'chili_1', isPrimary: true }]
      },
      {
        name: 'Tiêu Đen Hạt Phú Quốc - Black Pepper',
        price: 85000,
        weight: 200,
        unit: 'g',
        category: 'Spices',
        images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFrGrByi-nsE10wLJna1BETboVZM8Q6SM5hg&s', publicId: 'blackpepper_1', isPrimary: true }]
      },
      {
        name: 'Gừng Tươi - Fresh Ginger',
        price: 35000,
        weight: 500,
        unit: 'g',
        category: 'Spices',
        images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-79LWRzlfHS9ZQqhIEQv7ktUY-R2U_vBuQ&s', publicId: 'ginger_1', isPrimary: true }]
      },
      {
        name: 'Sả Cây - Lemongrass',
        price: 15000,
        weight: 500,
        unit: 'g',
        category: 'Spices',
        images: [{ url: 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/10/Screen-Shot-2021-10-07-at-11.08.27-PM.png', publicId: 'lemongrass_1', isPrimary: true }]
      },

      // 🍎 Fruits
      {
        name: 'Xoài Cát Hòa Lộc - Mango',
        price: 65000,
        weight: 1,
        unit: 'kg',
        category: 'Fruits',
        images: [{ url: 'https://statics.vinpearl.com/Vietnamese-mango-2_1702197210.jpg', publicId: 'mango_1', isPrimary: true }]
      },
      {
        name: 'Cam Sành Mọng Nước - Orange',
        price: 45000,
        weight: 1,
        unit: 'kg',
        category: 'Fruits',
        images: [{ url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Ambersweet_oranges.jpg/1280px-Ambersweet_oranges.jpg', publicId: 'orange_1', isPrimary: true }]
      },
      {
        name: 'Táo Nhập Khẩu Mỹ - Envy Apple',
        price: 120000,
        weight: 1,
        unit: 'kg',
        category: 'Fruits',
        images: [{ url: 'https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/articles/health_tools/healing_foods_slideshow/1800ss_getty_rf_apples.jpg?resize=750px:*&output-quality=75', publicId: 'apple_1', isPrimary: true }]
      },
      {
        name: 'Thanh Long Ruột Đỏ - Red Dragon Fruit',
        price: 35000,
        weight: 1,
        unit: 'kg',
        category: 'Fruits',
        images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb67u_pysMwsbL6018_XyhcQo_XxfBc8fJfA&s', publicId: 'dragonfruit_1', isPrimary: true }]
      },
      {
        name: 'Dưa Hấu Không Hạt - Watermelon',
        price: 18000,
        weight: 1,
        unit: 'kg',
        category: 'Fruits',
        images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCR2eBUKsjuLAl0oqz7YvkZJFU1C3znejG4g&s', publicId: 'watermelon_1', isPrimary: true }]
      },
      {
        name: 'Chuối Già Nam Mỹ - Cavendish Banana',
        price: 25000,
        weight: 1,
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
    const tomato = createdProducts.find((p) => p.name === 'Cà Chua Hữu Cơ - Organic Tomato');

    // 7. Orders & Order Products
    const order = await Order.create({
      user_id: customer._id,
      total_amount: 70000,
      order_status: 'Pending',
      payment_status: 'Unpaid',
      shipping_address: '123 Main St, Ho Chi Minh City, Vietnam',
    });

    await OrderProduct.create({
      order_id: order._id,
      product_id: tomato._id,
      quantity: 2,
      unit_price: 35000,
      total_price: 70000,
    });

    // 8. Payment Transaction
    await PaymentTransaction.create({
      order_id: order._id,
      amount: 70000,
      transaction_code: 'TXN123456',
      payment_status: 'Pending',
    });

    // 9. Stock Transactions
    const stockTx = await StockTransaction.create({
      user: admin._id,
      type: 'IN',
      total_price: 3500000,
      note: 'Initial Stock',
    });

    // Tạo transaction detail
    await StockTransactionDetail.create({
      stock_transaction: stockTx._id,
      product: tomato._id,
      quantity: 100,
      unit_price: 35000,
      total_price: 3500000,
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
