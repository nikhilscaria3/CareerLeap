const { Question, fumigationanswers } = require('../models/userModel');
const nodemailer = require('nodemailer');
// Get User Questions Controller
exports.getUserQuestions = async (req, res) => {
  try {
    const questions = await Question.find({});
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching questions' });
  }
};

// Get User Answers Controller
exports.getUserAnswers = async (req, res) => {
  const { useremail } = req.query;

  try {
    const useranswers = await fumigationanswers.findOne({ useremail: useremail });

    if (useranswers) {
      res.status(200).json([useranswers]);
    } else {
      res.status(404).json({ message: 'User answers not found' });
    }
  } catch (error) {
    console.error('Error fetching user answers', error);
    res.status(500).json({ error: 'Error fetching user answers' });
  }
};


exports.sendmail = async (req, res) => {
  const { message, recipientEmail } = req.body;
  console.log(message);
  console.log(recipientEmail);
  console.log(process.env.HOST);
  try {
    const transporter = nodemailer.createTransport({

      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipientEmail,
      subject: 'Fumigation Result Mail',
      text: message,
    };

    await transporter.sendMail(mailOptions);

    // Send a success response to the client
    res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);

    // Send an error response to the client
    res.status(500).json({ message: 'Error sending email.' });
  }
};
