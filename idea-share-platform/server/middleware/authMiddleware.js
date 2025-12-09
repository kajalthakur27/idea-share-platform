const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user does not exist' });
      }

      req.user = user;
      next();

    } catch (error) {
      console.error('Token verification error:', error.message);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, login again' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token, not authorized' });
      }

      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };

