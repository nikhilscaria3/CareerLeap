const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { User } = require('../models/userModel'); // Assuming you have a user model defined in userModel.js

// Set the destination and filename for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

router.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { email } = req.body;
    console.log(email);
    console.log(req.file);

    // Find the user in the database based on the provided email
    const user = await User.findOne({ email });

    if (!user) {
      console.log("errror");
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(user);
    // Update the user's profileImage with the file details
    user.profileImage = {
      filepath: req.file.path,
      filename: req.file.filename
    };

    // Save the user with the updated profileImage in the database
    await user.save();

    const users = await User.find();

    // Extract the profile images from each user
    const images = users.map((user) => {
      return user.profileImage;
    });

    console.log(images);
    // Return a success response
    res.json({ message: 'File uploaded and user updated successfully', file: req.file.filepath });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/getimage', async (req, res) => {
  try {

    const users = await User.find();

    // Extract the profile images from each user
    const images = users.map((user) => {
      return user.profileImage.filepath;
    });

    const username = users.map((user) => {
      return user.name;
    });


    res.json({ file: images, username: username });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/getuserdata/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email: id });
    console.log("user", user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // If the user is found, send the user data
    res.status(200).json({ profileimages: user.profileImage.filepath, useremail: user.email, userweek: user.week });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});



module.exports = router;
