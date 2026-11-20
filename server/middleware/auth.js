const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Protect a route: the user must send a valid JWT
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not logged in. Please login first');
  }

  let decoded;
  try {
    decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
  } catch (error) {
    res.status(401);
    throw new Error('Invalid or expired token. Please login again');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error('This user no longer exists');
  }

  req.user = user;
  next();
});

// Role-based access: allow only the listed roles
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error('You do not have permission to do this'));
  }
  next();
};

module.exports = { protect, authorize };
