const express = require('express');
const router = express.Router();
const { User } = require('../models/userModel');

router.get('/admin/user', async (req, res) => {
  try {
    const user = await User.find({})
    res.status(201).json({ message: 'User recieved successfully', data: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Registration Error" });
  }
});

router.post('/admin/userupdate', async (req, res) => {
  const { email, week } = req.body;
  console.log("data", req.body.email);
  try {
    // Find the user document by userId
    const user = await User.findOne({ email: email });

    // If the user is not found, return an error response
    if (!user) {
      console.log("error");
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the week property of the user document
    user.week = week;

    // Save the changes to the user document
    await user.save();

    res.status(201).json({ message: 'Week updated successfully', data: user, updatedWeek: week });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Update Error' });
  }
});





module.exports = router;

