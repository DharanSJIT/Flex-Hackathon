const mongoose = require('mongoose');
require('dotenv').config();
const Item = require('./models/Item');

const facilities = ['Facility 1', 'Facility 2', 'Facility 3', 'Facility 4', 'Facility 5'];
const categories = ['Circuit Board', 'Sensors', 'Connectors', 'Microchip', 'Battery Pack', 'Optical Lens', 'Chassis', 'Fastener', 'Cooling Fan', 'Power Supply', 'Motor Assembly', 'Display Panel'];

const items = [];

for (let i = 1; i <= 100; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const variant = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(Math.random() * 1000);
  const name = `${category} ${variant}`;
  const facility = facilities[Math.floor(Math.random() * facilities.length)];
  
  // Roughly 15-20% of items will be below threshold to show the red highlight
  const isLowStock = Math.random() < 0.15;
  const reorderThreshold = Math.floor(Math.random() * 100) + 20; 
  
  let quantity;
  if (isLowStock) {
    // 0 up to just below the threshold
    quantity = Math.floor(Math.random() * reorderThreshold); 
  } else {
    // Safely above the threshold
    quantity = reorderThreshold + Math.floor(Math.random() * 500) + 10; 
  }

  items.push({
    sku: `SKU-${String(i).padStart(3, '0')}`,
    name,
    quantity,
    facility,
    reorderThreshold
  });
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-warehouse');
    console.log('Connected to DB. Clearing old items...');
    await Item.deleteMany({});
    
    console.log(`Inserting ${items.length} seed items...`);
    await Item.insertMany(items);
    
    console.log('Seed successful!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
