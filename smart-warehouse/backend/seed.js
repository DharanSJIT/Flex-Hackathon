const mongoose = require('mongoose');
require('dotenv').config();
const Item = require('./models/Item');

const items = [
  { sku: 'SKU-001', name: 'Widget A', quantity: 50, facility: 'Facility 1', reorderThreshold: 20 },
  { sku: 'SKU-002', name: 'Widget B', quantity: 15, facility: 'Facility 1', reorderThreshold: 20 }, // Low stock
  { sku: 'SKU-003', name: 'Gizmo X', quantity: 120, facility: 'Facility 2', reorderThreshold: 50 },
  { sku: 'SKU-004', name: 'Gizmo Y', quantity: 5, facility: 'Facility 2', reorderThreshold: 10 }, // Low stock
  { sku: 'SKU-005', name: 'Connector C', quantity: 500, facility: 'Facility 3', reorderThreshold: 100 },
  { sku: 'SKU-006', name: 'Connector D', quantity: 80, facility: 'Facility 3', reorderThreshold: 100 }, // Low stock
  { sku: 'SKU-007', name: 'Sensor Array', quantity: 45, facility: 'Facility 1', reorderThreshold: 30 },
  { sku: 'SKU-008', name: 'Motor Assembly', quantity: 2, facility: 'Facility 2', reorderThreshold: 5 }, // Low stock
  { sku: 'SKU-009', name: 'Power Supply', quantity: 60, facility: 'Facility 1', reorderThreshold: 40 },
  { sku: 'SKU-010', name: 'Control Board', quantity: 22, facility: 'Facility 3', reorderThreshold: 25 }, // Low stock
  { sku: 'SKU-011', name: 'Display Panel', quantity: 30, facility: 'Facility 2', reorderThreshold: 20 },
  { sku: 'SKU-012', name: 'Cooling Fan', quantity: 200, facility: 'Facility 1', reorderThreshold: 150 },
  { sku: 'SKU-013', name: 'Chassis Part A', quantity: 15, facility: 'Facility 3', reorderThreshold: 15 }, // At threshold
  { sku: 'SKU-014', name: 'Fastener Pack', quantity: 1000, facility: 'Facility 1', reorderThreshold: 500 },
  { sku: 'SKU-015', name: 'Optical Lens', quantity: 8, facility: 'Facility 2', reorderThreshold: 15 }, // Low stock
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-warehouse');
    console.log('Connected to DB. Clearing old items...');
    await Item.deleteMany({});
    
    console.log('Inserting seed items...');
    await Item.insertMany(items);
    
    console.log('Seed successful!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
