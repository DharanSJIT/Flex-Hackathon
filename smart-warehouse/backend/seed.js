const mongoose = require('mongoose');
require('dotenv').config();
const Item = require('./models/Item');

const facilities = ['Facility 1', 'Facility 2', 'Facility 3', 'Facility 4', 'Facility 5'];
const items = [
  { sku: 'SKU-001', name: 'Widget A', quantity: 50, facility: 'Facility 1', reorderThreshold: 20 },
  { sku: 'SKU-002', name: 'Widget B', quantity: 15, facility: 'Facility 1', reorderThreshold: 20 },
  { sku: 'SKU-003', name: 'Connector X', quantity: 500, facility: 'Facility 2', reorderThreshold: 100 },
  { sku: 'SKU-004', name: 'Logic Board V2', quantity: 45, facility: 'Facility 2', reorderThreshold: 50 },
  { sku: 'SKU-005', name: 'Battery Pack', quantity: 200, facility: 'Facility 3', reorderThreshold: 50 },
];

for (let i = 6; i <= 100; i++) {
  const facilityNum = Math.floor(Math.random() * 5) + 1;
  const isLowStock = Math.random() > 0.8;
  const threshold = Math.floor(Math.random() * 50) + 10;
  const qty = isLowStock ? Math.floor(Math.random() * threshold) : Math.floor(Math.random() * 200) + threshold;
  
  items.push({
    sku: `SKU-${i.toString().padStart(3, '0')}`,
    name: `Generic Component ${i}`,
    quantity: qty,
    facility: `Facility ${facilityNum}`,
    reorderThreshold: threshold
  });
}

// Generate SmartFlow Slotting Data
// Grid is 20x20. Dispatch is at (0,0).
const gridSize = 20;
const usedLocations = new Set();

items.forEach(item => {
  // Random demand 1-100
  item.demandScore = Math.floor(Math.random() * 100) + 1;
  
  // High demand should be closer to (0,0). Low demand further away.
  // We'll search for the closest available spot based on demand.
  let targetDistance = (100 - item.demandScore) / 100 * (gridSize * 1.5);
  
  let bestX = 0, bestY = 0, minDiff = Infinity;
  for(let x = 0; x < gridSize; x++) {
    for(let y = 0; y < gridSize; y++) {
      const locKey = `${x},${y}`;
      if(usedLocations.has(locKey)) continue;
      
      const dist = Math.sqrt(x*x + y*y);
      const diff = Math.abs(dist - targetDistance);
      if(diff < minDiff) {
        minDiff = diff;
        bestX = x;
        bestY = y;
      }
    }
  }
  
  item.location = { x: bestX, y: bestY };
  usedLocations.add(`${bestX},${bestY}`);
});

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
