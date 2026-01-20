const Product = require('../models/Product');

const getAllProducts = async () => {
    // Populate lấy thông tin Category liên kết
    return await Product.find().populate('category_id');
};

module.exports = { getAllProducts };