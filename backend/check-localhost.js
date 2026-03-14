import mongoose from 'mongoose';
import 'dotenv/config';
import Category from './src/models/Category.js';

const checkLocalhost = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const categories = await Category.find({ image: /localhost/ });
        if (categories.length > 0) {
            console.log('Found categories with localhost images:');
            categories.forEach(c => console.log(`- ${c.name}: ${c.image}`));
        } else {
            console.log('No categories with localhost images found.');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkLocalhost();
