const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const multer = require('multer');
const path = require('path')
const verifyToken = require('../auth.js');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload a user profile image
router.post('/api/upload', upload.single('file'), userController.uploadUserProfileImage);

// Get user data by email
router.get('/getuserdata/:id', verifyToken, userController.getUserDataByEmail);

// Get user score by email
router.get('/getuserscore/:id', verifyToken, userController.getUserScoreByEmail);

// Add user ID by email
router.post('/addyourid', verifyToken, userController.addUserIdByEmail);

module.exports = router;
