const express = require('express');
const router = express.Router();
const { Timer } = require('../models/userModel');

router.post('/api/startTimer', async (req, res) => {
  const { startTimestamp, daysRemaining } = req.body;

  // Validate the data received from the client
  if (typeof startTimestamp !== 'number' || typeof daysRemaining !== 'number') {
    return res.status(400).json({ error: 'Invalid data format: startTimestamp and daysRemaining should be numbers.' });
  }

  try {
    // Save the data to the database (assuming TimerModel is your Mongoose model)
    let timerData = await Timer.findOne({}); // Assuming you only have one document in the Timer collection

    if (!timerData) {
      // If no timer data exists, create a new document
      timerData = new Timer({
        startTimestamp,
        daysRemaining,
      });
    } else {
      // If timer data exists, update the values
      timerData.startTimestamp = startTimestamp;
      timerData.daysRemaining = daysRemaining;
    }
    await timerData.save();

    console.log('Timer data saved to the database:', timerData);

    res.json({ message: 'Timer data saved successfully!' });
  } catch (error) {
    console.error('Error saving timer data:', error);
    res.status(500).json({ error: 'An error occurred while saving timer data.' });
  }
});




router.get('/api/getTimerData', async (req, res) => {
  try {
    // Fetch the timer data from the database
    const timerData = await Timer.findOne();

    if (timerData) {
      res.json({
        startTimestamp: timerData.startTimestamp,
        remainingDays: timerData.daysRemaining
      });
    } else {
      res.json({
        startTimestamp: null,
        remainingDays: null
      });
    }
  } catch (error) {
    console.error('Error fetching timer data from MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;