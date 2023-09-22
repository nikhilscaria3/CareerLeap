const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, 'your_secret_key'); // Replace 'your_secret_key' with your own secret key
    return decoded;
  } catch (err) {
    return null; // Token is invalid
  }
};

const authMiddleware = (req, res, next) => {
  const tokenString = req.headers.authorization;
console.log(tokenString);
  const tokenMatch = tokenString.match(/"token":"([^"]+)"/);

  if (tokenMatch && tokenMatch.length > 1) {
    const token = tokenMatch[1];
    const decoded = verifyToken(token); // Verify the extracted token
console.log(decoded);
    if (!decoded) {
      console.log("error");
      return res.status(401).json({ message: 'Invalid token.' });
    }

    // Token is valid, you can access the decoded data, e.g., decoded.userId
    // Proceed with the protected route logic here

    // Attach the decoded token data to the request for use in route handlers
    req.decodedToken = decoded;

    next(); // Call the next middleware or route handler
  } else {
    console.log("Token not found in the string.");
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
};

module.exports = authMiddleware;
