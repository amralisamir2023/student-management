const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const nodemailer = require('nodemailer');

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
        data: null,
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(
        (err) => err.message
      );

      return res.status(400).json({
        success: false,
        message: messages.join(', '),
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while registering the user',
      data: null,
    });
  }
};

// @desc    Authenticate a user and return a token
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
        data: null,
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while logging in',
      data: null,
    });
  }
};

// @desc    Get the currently logged in user's profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Current user fetched successfully',
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching the current user',
      data: null,
    });
  }
};

// @desc    Send password reset link
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email',
        data: null,
      });
    }

    const user = await User.findOne({ email });

    // Don't reveal whether the email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
        data: null,
      });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save token and expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const frontendUrl =
      process.env.FRONTEND_URL || 'http://localhost:4200';

    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    // Create mail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset.

Click the following link to reset your password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request this, please ignore this email.`,
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent successfully',
      data: null,
    });
  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while sending password reset email',
      data: null,
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password',
        data: null,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
        data: null,
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token',
        data: null,
      });
    }

    // Set new password
    user.password = password;

    // Clear reset token
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      data: null,
    });
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while resetting password',
      data: null,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
};