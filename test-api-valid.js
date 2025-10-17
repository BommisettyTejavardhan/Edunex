// Test script to verify API endpoints are working with valid token
const jwt = require('jsonwebtoken');

// Generate a valid token
const token = jwt.sign(
  { id: 1, name: 'Dr. Smith', role: 'Teacher' },
  'lmssecretkey',
  { expiresIn: '30d' }
);

console.log('Generated token:', token);

async function testAPI() {
  try {
    console.log('Testing /api/courses/teacher endpoint...');
    
    const response = await fetch('http://localhost:3003/api/courses/teacher', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Received data:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.json();
      console.log('Error response:', errorData);
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI();