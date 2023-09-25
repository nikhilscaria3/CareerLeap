const express = require('express');
const passport = require('passport');
const authController = require('../controllers/GoogleAuth');
const router = express.Router();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {User} = require('../models/userModel');


passport.use(new GoogleStrategy({
    clientID: '710019880977-d77t8mffj0e0cbsl9q1hja4ntesg9mdi.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: `http://localhost:5000/auth/google/callback`,
  },
  async(accessToken, refreshToken, profile, done) => {
    // Check if the user already exists in the database
    try {
      // Check if the user already exists in the database
      const existingUser = await User.findOne({ googleId: profile.id });
  
      if (!existingUser) {
        // If user doesn't exist, create a new user in the database
        const newUser = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        });
  
        await newUser.save();
        done(null, newUser);
      } else {
        // If user exists, simply return the user object
        done(null, existingUser);
      }
    } catch (error) {
      done(error);
    }
  }));
  
  
  // Serialize user data
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
  
  // Routes
  router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
  
module.exports = router;
