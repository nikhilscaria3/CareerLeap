const express = require('express');
const router = express.Router();
const { RealTimeMessage } = require('../models/userModel')

router.get('/getrealtimessages', async (req, res) => {
    const { email } = req.query;
    try {
      const messages = await RealTimeMessage.find({
        $or: [
          { senderEmail: email },
          { recipientEmail: email }
        ]
      }).sort({ timestamp: 1 });
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'An error occurred while fetching messages' });
    }
  });
  

  router.get('/getrealreceivertimessages', async (req, res) => {
    const { email } = req.query;
    try {
      const messages = await RealTimeMessage.find({
          recipientEmail: email 
        
      }).sort({ timestamp: 1 });
      console.log(messages);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'An error occurred while fetching messages' });
    }
  });

  router.get('/getselectedadminmessages', async (req, res) => {
    const { email } = req.query;
    try {
      const messages = await RealTimeMessage.find({
        $or: [
          { senderEmail: email },
          { recipientEmail: email }
        ]
      }).sort({ timestamp: 1 });
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'An error occurred while fetching messages' });
    }
  });

  

module.exports = router


