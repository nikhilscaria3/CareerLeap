const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const fs = require('fs');
const path = require('path');
const { User, Admin } = require('../models/userModel');
const axios = require("axios");


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the provided email exists in the database
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: 'Failed to login - User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

    if (isPasswordMatch) {
      const tokenPayload = { email: existingUser.email, userId: existingUser._id };
      const token = jwt.sign(tokenPayload, 'your_secret_key', { expiresIn: '8h' }); // Replace 'your_secret_key' with your own secret key

      res.cookie('jwtLoginToken', token, {
        httpOnly: true,
        secure: true, // Set "secure" to true in production if using HTTPS
        sameSite: 'strict',
        maxAge: 10 * 60 * 60 * 1000, // Token expiration time (3 hours in this example)
      });

      res.cookie('emailid', token, {
        httpOnly: true,
        secure: true, // Set "secure" to true in production if using HTTPS
        sameSite: 'strict',
        maxAge: 3 * 60 * 60 * 1000, // Token expiration time (3 hours in this example)
      });

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

 

      const emailTemplatePath = path.join(__dirname, 'otp.html');
      let emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

      // Replace the {{otp}} placeholder with the actual OTP
      emailTemplate = emailTemplate.replace('{{otp}}', otp);

      // Send OTP via email
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'CareerLeap Login OTP',
        html: emailTemplate
      };

      await transporter.sendMail(mailOptions);

      // Update user's OTP in the database
      existingUser.otp = otp;
      await existingUser.save()

      setTimeout(async () => {
        // Find the user again (to ensure data consistency)
        const updatedUser = await User.findOne({ email });
        if (updatedUser && updatedUser.otp === null) {
          // User's OTP is already null (cleared after verification or expiration)
          return;
        }
        updatedUser.otp = null;
        await updatedUser.save();
      }, 60000); // 1 minute in milliseconds


      const success = "success"

      return res.status(200).json({ message: 'User logged in successfully', data: existingUser.email, token, success });
    } else {
      return res.status(401).json({ message: 'Invalid password' });
    }
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
};


exports.loginVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Schedule OTP deletion after 1 minute

    const isOtpValid = user.otp === otp;

    if (!isOtpValid) {
      return res.status(401).json({ message: 'Invalid OTP.' });
    }

    const success = "success"
    const tokenPayload = { email: user.email, userId: user._id };
    const token = jwt.sign(tokenPayload, 'your_secret_key', { expiresIn: '8h' }); // Replace 'your_secret_key' with your own secret key

    return res.status(200).json({ message: 'OTP Matched Successful.', data: user.email, token, success });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'An error occurred.' });
  }
};


exports.googleLogin = async (req, res) => {
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

    const { given_name: name, family_name: lastName, email, picture } = response.data;

    const existingUser = await User.findOne({ email });
 
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    const tokenPayload = { email: existingUser.email, userId: existingUser._id };
    const token = jwt.sign(tokenPayload, 'your_secret_key', { expiresIn: '8h' }); // Replace 'your_secret_key' with your own secret key

    return res.status(200).json({ data: existingUser.email, token });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(400).json({ message: "Invalid access token or server error!" });
  }
};



exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
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

    const emailTemplatePath = path.join(__dirname, 'otp.html');
    let emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

    // Replace the {{otp}} placeholder with the actual OTP
    emailTemplate = emailTemplate.replace('{{otp}}', otp);


    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'CareerLeap Resend OTP',
      html: emailTemplate, // Use the modified HTML content
    };

    await transporter.sendMail(mailOptions);
    // Update user's OTP in the database
    existingUser.otp = otp;
    await existingUser.save()


    return res.status(200).json({ message: 'OTP resent successfully.' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'An error occurred.' });
  }
};



exports.adminLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the admin with the provided email exists in the database
    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordMatch = await bcrypt.compare(password, existingAdmin.password);

    if (isPasswordMatch) {
      const tokenPayload = { email: existingAdmin.email, adminId: existingAdmin._id };
      const token = jwt.sign(tokenPayload, 'your_secret_key', { expiresIn: '1h' }); // Replace 'your_secret_key' with your own secret key
      return res.status(200).json({ message: 'Admin logged in successfully', data: existingAdmin.email, token });
    } else {
      return res.status(401).json({ error: 'Invalid password' });
    }
  } catch (err) {
    
    res.status(500).json({ error: err.message });
  }
};



