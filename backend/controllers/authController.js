const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');

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

// Try to use real MongoDB Course model, fallback to mock if MongoDB is not available
let Course;
let useMockCourseDB = false;

try {
  Course = require('../models/Course');
  // Test if we can connect to MongoDB
  const mongoose = require('mongoose');
  if (!mongoose.connection.readyState) {
    throw new Error('MongoDB not connected');
  }
} catch (error) {
  console.log('MongoDB not available for courses, using mock Course model');
  Course = require('../models/MockCourse');
  useMockCourseDB = true;
}

// Generate JWT Token
const generateToken = (id) => {
  // Check if id is valid
  if (!id) {
    throw new Error('User ID is required to generate token');
  }
  
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error('Failed to generate authentication token');
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      // Register teacher in mock course model if using mock DB
      if (useMockCourseDB && role === 'Teacher' && user._id) {
        console.log(`Registering teacher: ${user.name} with ID: ${user._id}`);
        Course.registerTeacher(user._id, user.name);
        console.log('Current teachers in mock course model:', Course.getTeachers());
      }
      
      // Ensure user._id exists before generating token
      if (!user._id) {
        console.error('User object missing _id:', user);
        res.status(500);
        throw new Error('User registration failed: missing user ID');
      }
      
      // Send response with user data and token
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()), // Ensure ID is a string
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error; // Re-throw the error to be handled by asyncHandler
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Register teacher in mock course model if using mock DB
    if (useMockCourseDB && user.role === 'Teacher' && user._id) {
      console.log(`Registering teacher on login: ${user.name} with ID: ${user._id}`);
      Course.registerTeacher(user._id, user.name);
      console.log('Current teachers in mock course model:', Course.getTeachers());
    }
    
    // Ensure user._id exists before generating token
    if (!user._id) {
      console.error('User object missing _id:', user);
      res.status(500);
      throw new Error('Login failed: missing user ID');
    }
    
    // Send response with user data and token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()), // Ensure ID is a string
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = {
  registerUser,
  loginUser,
};