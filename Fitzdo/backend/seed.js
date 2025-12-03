require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const productsData = require('./data/products.json');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fitzdo';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('✓ Cleared existing products');

    // Insert new products
    console.log('Inserting products...');
    await Product.insertMany(productsData);
    console.log(`✓ Inserted ${productsData.length} products`);

    console.log('\n✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
