const express = require('express');
const router = express.Router();
const { Message,GlobalMessage } = require('../models/userModel');

// Define API routes for user registration, login, etc.
router.post('/api/setmessage', async (req, res) => {
  try {
    const { email, message, adminemail } = req.body;
    console.log(req.body.email);

    // Hash the passwor
    // Create a new user
    const newUser = new Message({
      from: adminemail,
      to: email,
      message
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'Message Sended successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Sended Error" });
  }
});

// Add more API routes as needed for login, user profiles, etc.

router.get('/api/getmessage/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log(req.body.email);
    const message = await Message.find({ to: email });
    const messagevalue = message.map(message => message.message)
    const fromemail = message.map(message => message.from)

    console.log(fromemail);
    console.log(messagevalue);
    if (message) {
      res.status(200).json({ successmessage: 'Message sent successfully', message: messagevalue, fromemail: fromemail });
    } else {
      res.status(404).json({ errormessage: 'Message not found for the provided email' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////


// Define API routes for user registration, login, etc.
router.post('/api/setglobalmessage', async (req, res) => {
  try {
    const { email, message, adminemail } = req.body;
    console.log(req.body.email);

    // Hash the passwor
    // Create a new user
    const newUser = new GlobalMessage({
      from: adminemail,
      to: email,
      message
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'Message Sended successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Sended Error" });
  }
});

// Add more API routes as needed for login, user profiles, etc.

router.get('/api/getglobalmessage', async (req, res) => {
  try {
    const message = await GlobalMessage.find({});

    if (message) {
      res.status(200).json({ successmessage: 'Message sent successfully', message: message});
    } else {
      res.status(404).json({ errormessage: 'Message not found for the provided email' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
