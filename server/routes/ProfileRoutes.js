const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const multer = require('multer');
const path = require('path')
const verifyToken = require('../auth.js');

// Set up Multer for file uploads
const storage = multer.memoryStorage();

const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files


// Upload a user profile image
router.post('/api/upload', upload.single('file'), userController.uploadUserProfileImage);

// Get user data by email
router.get('/getuserdata/:id', verifyToken, userController.getUserDataByEmail);

// Get user score by email
router.get('/getuserscore/:id', verifyToken, userController.getUserScoreByEmail);

// Add user ID by email
router.post('/addyourid', verifyToken, userController.addUserIdByEmail);

module.exports = router;
