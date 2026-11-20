const jwt = require('jsonwebtoken');

// Creates a JWT. The secret comes from the .env file
module.exports = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
