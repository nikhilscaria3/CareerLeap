const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const multer = require('multer');
const path = require('path')
const verifyToken = require('../auth.js');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, callback) {
    // Use the original file name with a timestamp to avoid naming conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });


// Upload a user profile image
router.post('/api/upload', upload.single('file'), userController.uploadUserProfileImage);

// Get user data by email
router.get('/getuserdata/:id', verifyToken, userController.getUserDataByEmail);

// Get user score by email
router.get('/getuserscore/:id', verifyToken, userController.getUserScoreByEmail);

// Add user ID by email
router.post('/addyourid', verifyToken, userController.addUserIdByEmail);

module.exports = router;
