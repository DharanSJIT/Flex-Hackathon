const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { GoogleGenAI } = require('@google/genai');

const Item = require('../models/Item');
const Hazard = require('../models/Hazard');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Cloudinary config
if (process.env.CLOUDINARY_URL) {
  // It reads from CLOUDINARY_URL by default if set
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Gemini config
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// GET /api/items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// POST /api/assistant/ask
router.post('/assistant/ask', async (req, res) => {
  try {
    const { question } = req.body;
    const items = await Item.find({});
    
    // Serialize inventory data for context
    const context = `
      Current Inventory:
      ${items.map(item => `- SKU: ${item.sku}, Name: ${item.name}, Quantity: ${item.quantity}, Facility: ${item.facility}, Reorder Threshold: ${item.reorderThreshold}`).join('\n')}
    `;

    const prompt = `
      You are a smart warehouse assistant. Answer the user's question based strictly on the following inventory data. 
      Keep the answer concise and helpful.
      
      ${context}

      User Question: ${question}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ answer: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get answer from assistant' });
  }
});

// POST /api/po/generate
router.post('/po/generate', async (req, res) => {
  try {
    const { item } = req.body;
    const prompt = `
      You are an automated procurement system for Flex Smart Warehouse.
      Generate a professional, concise Purchase Order (PO) to send to a supplier to restock the following item:
      SKU: ${item.sku}
      Name: ${item.name}
      Current Quantity: ${item.quantity}
      Reorder Threshold: ${item.reorderThreshold}
      Facility: ${item.facility}

      The PO should request enough units to get well above the threshold (e.g., request 1000 units).
      Format as a plain text email or document.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ poText: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate PO' });
  }
});

// GET /api/hazards
router.get('/hazards', async (req, res) => {
  try {
    const hazards = await Hazard.find({}).sort({ createdAt: -1 });
    res.json(hazards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hazards' });
  }
});

// POST /api/hazards
router.post('/hazards', upload.single('photo'), async (req, res) => {
  try {
    const { description, severity, facility } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const hazard = new Hazard({
      description,
      severity,
      facility,
      imageUrl,
    });

    await hazard.save();
    res.json(hazard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to report hazard' });
  }
});

module.exports = router;
