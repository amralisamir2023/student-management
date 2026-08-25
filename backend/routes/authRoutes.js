const express = require('express');

const router = express.Router();

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);

router.post('/login', login);

router.get('/me', protect, getMe);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password/:token', resetPassword);

module.exports = router;