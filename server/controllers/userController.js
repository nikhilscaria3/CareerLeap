const { User, UserId } = require('../models/userModel');
const path = require('path')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
 credentials: {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
 
});

// Upload a user profile image
exports.uploadUserProfileImage = async (req, res) => {
  try {
    const { email } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const params = {
      Bucket: 'careerleap', // Replace with your S3 bucket name
      Key: `${req.file.originalname}`, // Prefix the file name with userId or other unique identifier if needed
      Body: req.file.buffer,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return res.json({ message: 'Invalid image file type' });
    }

    // Construct the image URL manually
    const imageUrl = `https://careerleap.s3.eu-north-1.amazonaws.com/${req.file.originalname}`;

    user.imageUrl = imageUrl;
    await user.save();

    res.json({ message: 'File uploaded and user updated successfully', url: imageUrl });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Get user data by email
exports.getUserDataByEmail = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ email: id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      profileimages: user.profileImage.filepath,
      imageUrl:user.imageUrl,
      useremail: user.email,
      userid: user.userid,
      userweek: user.week,
    });
  } catch (error) {

    res.status(500).json({ message: 'Server Error' });
  }
};



// Get user score by email
exports.getUserScoreByEmail = async (req, res) => {
  const { id } = req.params;

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
