const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Register attempt:', { name, email });

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    console.log('User created:', user._id);
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({ message: 'Server error, try again later' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User found, checking password...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Login successful for:', email);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error, try again later' });
  }
};

// @desc    Get current user (protected route)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is set in auth middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user found' });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    res.json(user);
  } catch (error) {
    console.error('GetMe Error:', error.message);
    res.status(500).json({ message: 'Server error, try again later' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
