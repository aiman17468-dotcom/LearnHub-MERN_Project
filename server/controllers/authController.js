const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const formatUser = require('../utils/formatUser');

// POST /api/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  if (String(password).length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }
  // Public registration can only create student or instructor (admin is created with the seed script)
  if (role && !['student', 'instructor'].includes(role)) {
    res.status(400);
    throw new Error('Role must be student or instructor');
  }

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) {
    res.status(409);
    throw new Error('Email is already registered');
  }

  const user = await User.create({
    name: String(name),
    email: String(email),
    password: String(password),
    role: role || 'student',
  });
  res.status(201).json({ token: generateToken(user), user: formatUser(user) });
});

// POST /api/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({
    email: String(email).toLowerCase().trim(),
  }).select('+password');

  if (!user || !(await user.comparePassword(String(password)))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.json({ token: generateToken(user), user: formatUser(user) });
});

// GET /api/me  (current logged-in user)
const getMe = (req, res) => {
  res.json(formatUser(req.user));
};

module.exports = { register, login, getMe };
