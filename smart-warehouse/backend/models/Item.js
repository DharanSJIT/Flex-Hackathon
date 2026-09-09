const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  sku: String,
  name: String,
  quantity: Number,
  facility: String,
  reorderThreshold: Number,
});

module.exports = mongoose.model('Item', itemSchema);
