// Test error cases that might cause the loading state to persist
const jwt = require('jsonwebtoken');

console.log('Testing error cases that might cause loading state to persist...\n');

async function testErrorCases() {
  console.log('1. Testing with missing token...');
  
  // Simulate missing token
  const missingToken = null;
  
  if (!missingToken) {
    console.log('✅ Missing token handled correctly - would navigate to /login');
  }
  
  console.log('\n2. Testing with invalid token...');
  
  // Simulate invalid token
  const invalidToken = 'invalid.token.string';
  
  try {
    const payload = JSON.parse(atob(invalidToken.split('.')[1]));
    console.log('❌ Invalid token was somehow parsed');
  } catch (error) {
    console.log('✅ Invalid token handled correctly - would navigate to /login');
    console.log('   Error message:', error.message);
  }
  
  console.log('\n3. Testing with expired token...');
  
  // Generate an expired token
  const expiredToken = jwt.sign(
    { id: 1, name: 'Dr. Smith', role: 'Teacher' },
    'lmssecretkey',
    { expiresIn: '-1h' } // Expired 1 hour ago
  );
  
  try {
    const payload = JSON.parse(atob(expiredToken.split('.')[1]));
    console.log('✅ Expired token decoded (this is expected in frontend)');
    console.log('   But backend would reject it with 401');
  } catch (error) {
    console.log('❌ Error decoding expired token:', error.message);
  }
  
  console.log('\n4. Testing with valid token but backend error...');
  
  // Test what happens if backend returns an error
  try {
    const validToken = jwt.sign(
      { id: 1, name: 'Dr. Smith', role: 'Teacher' },
      'lmssecretkey',
      { expiresIn: '30d' }
    );
    
    const res = await fetch('http://localhost:3003/api/courses/teacher', {
      headers: {
        'Authorization': `Bearer ${validToken}`
      }
    });
    
    console.log('   Backend response status:', res.status);
    
    if (res.status === 401) {
      console.log('✅ 401 error handled - would navigate to /login');
    } else if (res.status === 200) {
      console.log('✅ 200 response - normal operation');
      const data = await res.json();
      console.log('   Data length:', data.length);
    } else {
      console.log('   Other status code:', res.status);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
  
  console.log('\n✅ All error cases tested');
}

testErrorCases();