import mongoose from 'mongoose';
import 'dotenv/config';
import Category from './src/models/Category.js';

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const categories = await Category.find();
        console.log('Categories in DB:', JSON.stringify(categories, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
