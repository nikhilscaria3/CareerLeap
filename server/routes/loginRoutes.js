const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, Admin } = require('../models/userModel');
const jwt = require('jsonwebtoken');



// Define the route for user login
router.post('/loginUser', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    // Check if the user with the provided email exists in the database
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

    if (isPasswordMatch) {
      const tokenPayload = { email: existingUser.email, userId: existingUser._id };
      const token = jwt.sign(tokenPayload, 'your_secret_key', { expiresIn: '8h' }); // Replace 'your_secret_key' with your own secret key

      res.cookie('jwtLoginToken', token, {
        httpOnly: true,
        secure: true, // Set "secure" to true in production if using HTTPS
        sameSite: 'strict',
        maxAge: 10 * 60 * 60 * 1000, // Token expiration time (3 hours in this example)
      });

      res.cookie('emailid', token, {
        httpOnly: true,
        secure: true, // Set "secure" to true in production if using HTTPS
        sameSite: 'strict',
        maxAge: 3 * 60 * 60 * 1000, // Token expiration time (3 hours in this example)
      });

      const success = "success"

      return res.status(200).json({ message: 'User logged in successfully', data: existingUser.email, token, success });
    } else {
      return res.status(401).json({ error: 'Invalid password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/adminloginUser', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    // Check if the user with the provided email exists in the database
    const existingUser = await Admin.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

    if (isPasswordMatch) {
      const tokenPayload = { email: existingUser.email, userId: existingUser._id };
      const token = jwt.sign(tokenPayload, 'your_secret_key', { expiresIn: '1h' }); // Replace 'your_secret_key' with your own secret key


      return res.status(200).json({ message: 'Admin logged in successfully', data: existingUser.email, token });
    } else {
      return res.status(401).json({ error: 'Invalid password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
