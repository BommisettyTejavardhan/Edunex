// Test script to verify frontend can connect to backend through proxy
const jwt = require('jsonwebtoken');

// Generate a valid token for the teacher
const token = jwt.sign(
  { id: 1, name: 'Dr. Smith', role: 'Teacher' },
  'lmssecretkey',
  { expiresIn: '30d' }
);

console.log('Testing frontend proxy connection to backend...');

async function testFrontendConnection() {
  try {
    console.log('\n=== Testing proxy connection (through frontend port) ===');
    const coursesResponse = await fetch('http://localhost:3000/api/courses/teacher', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Proxy response status:', coursesResponse.status);
    
    if (coursesResponse.ok) {
      const coursesData = await coursesResponse.json();
      console.log(`✅ Proxy connection successful - fetched ${coursesData.length} courses`);
      if (coursesData.length > 0) {
        console.log('First course:', coursesData[0].title);
      }
    } else {
      const errorData = await coursesResponse.json();
      console.log('❌ Proxy connection failed:', errorData);
    }
    
  } catch (error) {
    console.error('Error testing frontend proxy connection:', error);
  }
}

testFrontendConnection();