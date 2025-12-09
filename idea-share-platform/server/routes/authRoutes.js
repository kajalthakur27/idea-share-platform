const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes - koi bhi access kar sakta hai
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private route - sirf logged in user access kar sakta hai
router.get('/me', protect, getMe);

module.exports = router;
