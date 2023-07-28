const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/userModel');

// Define API routes for user registration, login, etc.
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body.email);
    // Check if the username is already taken
    const existingUser = await User.findOne({ email });


    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Registration Error" });
  }
});

// Add more API routes as needed for login, user profiles, etc.



module.exports = router;
