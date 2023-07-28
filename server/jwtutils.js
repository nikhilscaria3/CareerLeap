const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' }); // Replace 'your_secret_key' with your own secret key
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, 'your_secret_key'); // Replace 'your_secret_key' with your own secret key
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
