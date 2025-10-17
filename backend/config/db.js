const mongoose = require('mongoose');

const connectDB = async () => {
  // Always use mock database for testing
  console.log('⚠️  Using mock database for testing (MongoDB connection skipped)');
  return { success: false, error: 'Mock database in use' };
};

module.exports = connectDB;