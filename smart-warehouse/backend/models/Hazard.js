const mongoose = require('mongoose');

const hazardSchema = new mongoose.Schema({
  description: String,
  severity: { type: String, enum: ['low', 'medium', 'high'] },
  imageUrl: String,
  facility: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Hazard', hazardSchema);
