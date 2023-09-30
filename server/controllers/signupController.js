const bcrypt = require('bcrypt');
const { User, Enquiry } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const axios = require("axios");

// Handle user registration
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists. Try to login' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      status: "Fumigation",
      week: "Week 1",
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration Error" });
  }
};

// Handle Google registration
exports.googleRegister = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "Missing access token!" });
    }

    // Google authentication
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    const { given_name: firstName, family_name: lastName, email, picture } = response.data;

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists!" });

    const result = await User.create({ verified: "true", email, firstName, lastName, week: "Week 1", profilePicture: picture });

    return res.status(200).json({ data: result });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Invalid access token or server error!" });
  }
};

// Handle user password reset request
exports.forgotUserPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const otp = randomstring.generate({ length: 6, charset: 'numeric' });

    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });

    // Send OTP via email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    // Update user's OTP in the database
    user.otp = otp;
    await user.save();

    return res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'An error occurred.' });
  }
};

// Handle OTP verification and password reset
exports.verifyOTPAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isOtpValid = user.otp === otp;

    if (!isOtpValid) {
      return res.status(401).json({ message: 'Invalid OTP.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's hashed password and reset OTP
    user.password = hashedPassword;
    user.otp = null;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'An error occurred.' });
  }
};

// Handle user enquiry submission
exports.submitEnquiry = async (req, res) => {
  try {
    const formData = req.body.formData;

    const existingemail = await Enquiry.findOne({ email: formData.email });

    if (existingemail) {
      return res.status(200).json({ message: 'Already Exist Your Response' });
    }

    const newEnquiry = new Enquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    });

    await newEnquiry.save();

    res.status(200).json({ message: 'Form data received and saved successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the form data' });
  }
};
