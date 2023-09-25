const { User, UserId } = require('../models/userModel');
const path = require('path')

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];



// Upload a user profile image
exports.uploadUserProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { email } = req.body;

    // Find the user in the database based on the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    // Check if the file extension is allowed
    if (!allowedExtensions.includes(fileExtension)) {
      return res.json({ message: 'Invalid image file type' });
    }

    // Update the user's profileImage with the file details
    user.profileImage = {
      filepath: req.file.path,
      filename: req.file.filename,
    };

    // Save the user with the updated profileImage in the database
    await user.save();

    const users = await User.find();

    // Extract the profile images from each user
    const images = users.map((user) => {
      return user.profileImage.filepath;
    });

    res.json({ message: 'File uploaded and user updated successfully', file: req.file.filepath });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Get user data by email
exports.getUserDataByEmail = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const user = await User.findOne({ email: id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      profileimages: user.profileImage.filepath,
      useremail: user.email,
      userid: user.userid,
      userweek: user.week,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



// Get user score by email
exports.getUserScoreByEmail = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const userscore = await User.findOne({ email: id });
    if (!userscore) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ score: userscore.score });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



// Add user ID by email
exports.addUserIdByEmail = async (req, res) => {
  const { useremail, userid } = req.body;

  try {
    const findUser = await User.findOne({ email: useremail });

    if (findUser.userid === userid) {
      findUser.userid = userid;
      findUser.status = 'BrotoUser';
      await findUser.save();
      const message = 'useridadded';
      console.log(message);
      res.status(200).json(message);
    } else {
      res.status(400).json({ message: 'Invalid user ID' });
    }
  } catch (error) {
    console.error('Error updating user', error);
    res.status(500).json({ error: 'Error updating user' });
  }
};
