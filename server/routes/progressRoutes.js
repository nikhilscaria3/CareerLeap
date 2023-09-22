const express = require('express');
const router = express.Router();
const {Progress} = require('../models/userModel');
// Mock database to store progress (replace with your actual database logic)

// Update progress
router.post('/update', async(req, res) => {
    try {
        const { userId, videoId, progress } = req.body;
    
        // Update or create progress entry in the database
        const updatedProgress = await Progress.findOneAndUpdate(
          { userId, videoId },
          { progress },
          { upsert: true, new: true }
        );
    
        res.json({ success: true, updatedProgress });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

module.exports = router;
