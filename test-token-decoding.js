// Test token decoding to see if there are any issues
const jwt = require('jsonwebtoken');

// Generate a valid token for the teacher
const validToken = jwt.sign(
  { id: 1, name: 'Dr. Smith', role: 'Teacher' },
  'lmssecretkey',
  { expiresIn: '30d' }
);

console.log('Testing token decoding...\n');

function testTokenDecoding(token) {
  try {
    console.log('1. Testing token retrieval from localStorage simulation...');
    if (!token) {
      console.log('❌ No token found');
      return false;
    }
    console.log('✅ Token found');
    
    console.log('\n2. Testing token decoding...');
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('✅ Token decoded successfully');
    console.log('   Payload:', JSON.stringify(payload, null, 2));
    
    console.log('\n3. Testing user role extraction...');
    const userRole = payload.role || 'Teacher';
    const userName = payload.name || 'User';
    console.log('✅ User role extracted:', userRole);
    console.log('✅ User name extracted:', userName);
    
    return {
      role: userRole,
      name: userName
    };
  } catch (error) {
    console.log('❌ Error in token decoding:', error.message);
    return false;
  }
}

// Test token decoding
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRyLiBTbWl0aCIsInJvbGUiOiJUZWFjaGVyIiwiZXhwIjoxNzYzMjcyODI4fQ.5K1y5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5';

try {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token decoded successfully:', payload);
} catch (error) {
  console.error('Error decoding token:', error);
}

// Test with valid token
console.log('=== Testing with valid token ===');
const result = testTokenDecoding(validToken);
if (result) {
  console.log('\n✅ Token decoding test PASSED');
} else {
  console.log('\n❌ Token decoding test FAILED');
}

// Test with invalid token
console.log('\n=== Testing with invalid token ===');
const invalidResult = testTokenDecoding('invalid.token.here');
if (invalidResult) {
  console.log('\n✅ Invalid token handled correctly');
} else {
  console.log('\n❌ Invalid token not handled correctly');
}