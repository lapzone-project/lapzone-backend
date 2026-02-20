const mongoose = require('mongoose');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create a Sample Brand
    let brand = await Brand.findOne({ name: 'Apple' });
    if (!brand) {
      brand = await Brand.create({
        name: 'Apple',
        logo: 'https://logo.clearbit.com/apple.com Dram',
        description: 'Premium electronics and software'
      });
      console.log('✅ Created Brand: Apple');
    }

    // Create a Sample Category
    let category = await Category.findOne({ name: 'Laptops' });
    if (!category) {
      category = await Category.create({
        name: 'Laptops',
        slug: 'laptops',
        description: 'Portable computing devices'
      });
      console.log('✅ Created Category: Laptops');
    }

    console.log('\n--- USE THESE IDs FOR TESTING ---');
    console.log('Brand ID (Apple):', brand._id);
    console.log('Category ID (Laptops):', category._id);
    console.log('--- --- --- --- --- --- --- --- ---\n');

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
