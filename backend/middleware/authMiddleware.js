const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');

// Try to use real MongoDB User model, fallback to mock if MongoDB is not available
let User;
let useMockDB = false;

try {
  User = require('../models/User');
  // Test if we can connect to MongoDB
  const mongoose = require('mongoose');
  if (!mongoose.connection.readyState) {
    throw new Error('MongoDB not connected');
  }
} catch (error) {
  console.log('MongoDB not available, using mock database');
  User = require('../models/MockUser');
  useMockDB = true;
}

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);
      
      // Get user from database or use mock data
      if (useMockDB) {
        // Try to get actual user data using findById
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = {
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          };
          console.log('Mock user set:', req.user);
        } else {
          // Fallback to default mock user
          req.user = {
            id: decoded.id,
            _id: decoded.id,
            name: 'Mock User',
            email: 'mock@example.com',
            role: 'Teacher' // Default to Teacher for mock
          };
        }
      } else {
        // Get user from database
        req.user = await User.findById(decoded.id).select('-password');
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };