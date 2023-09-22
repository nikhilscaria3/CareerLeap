const express = require('express');
const router = express.Router();
const {loginUser,loginVerifyOTP,googleLogin,resendOTP,adminLoginUser} = require('../controllers/loginController');

// User login
router.post('/loginUser', loginUser);

// Verify OTP for user login
router.post('/loginVerifyOTP', loginVerifyOTP);

// User login with Google
router.post('/GoogleLogin', googleLogin);

// Resend OTP for user login
router.post('/resendOTP', resendOTP);

// Admin login
router.post('/adminloginUser', adminLoginUser);

module.exports = router;
