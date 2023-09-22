const express = require('express');
const router = express.Router();
const userController = require('../controllers/signupController');

// Handle user registration
router.post('/register', userController.registerUser);

// Handle Google registration
router.post('/GoogleRegister', userController.googleRegister);

// Handle user password reset request
router.post('/forgotuserpassword', userController.forgotUserPassword);

// Handle OTP verification and password reset
router.post('/verifyotp', userController.verifyOTPAndResetPassword);

// Handle user enquiry submission
router.post('/enquiry', userController.submitEnquiry);

module.exports = router;
