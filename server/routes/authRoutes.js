const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register); // POST /api/register
router.post('/login', login);       // POST /api/login
router.get('/me', protect, getMe);  // GET  /api/me

module.exports = router;
