const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  sku: String,
  name: String,
  quantity: Number,
  facility: String,
  reorderThreshold: Number,
  demandScore: { type: Number, default: 50 }, // 1-100 (100 is high demand)
  location: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Item', itemSchema);
