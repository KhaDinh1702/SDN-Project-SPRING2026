const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freshmart';
    await mongoose.connect(mongoUri);
    console.log(' FreshMart MongoDB Connected!');
  } catch (err) {
    console.error(' Connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;