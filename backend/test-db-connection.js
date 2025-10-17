// test-db-connection.js
// Test script to check database connection and sample data

const mockDB = require('./mock-db');

async function testDB() {
  try {
    console.log('Testing database connection...');
    
    // Check existing users
    const users = mockDB.getAll('users');
    console.log('Existing users:', users);
    
    // Try to find our test user
    const testUser = await mockDB.findOne('users', { email: 'test@example.com' });
    console.log('Test user found:', testUser);
    
    console.log('✅ Database test completed');
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  }
}

testDB();