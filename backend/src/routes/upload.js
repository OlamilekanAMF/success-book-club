const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { auth } = require('../middleware/auth');

// Simple upload - returns base64 data URL (no storage bucket needed)
router.post('/', auth, async (req, res) => {
  try {
    const { fileName, fileData, contentType } = req.body;

    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'File name and data are required' });
    }

    // Return as base64 data URL (works without storage)
    const dataUrl = `data:${contentType || 'image/jpeg'};base64,${fileData}`;
    
    console.log('Image uploaded successfully (base64)');
    
    res.json({
      url: dataUrl,
      path: fileName
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
});

module.exports = router;
