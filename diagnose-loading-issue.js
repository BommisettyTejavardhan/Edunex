// Comprehensive test to diagnose the loading issue
const jwt = require('jsonwebtoken');

console.log('Diagnosing teacher dashboard loading issue...\n');

// Test different scenarios that might cause the loading state to persist

console.log('1. Testing with no token in localStorage...');
// This would cause navigation to login, so it shouldn't cause loading issue

console.log('\n2. Testing with invalid token...');
const invalidToken = 'invalid.token.string';
try {
  const payload = JSON.parse(atob(invalidToken.split('.')[1]));
  console.log('❌ Invalid token was parsed (unexpected)');
} catch (error) {
  console.log('✅ Invalid token correctly causes error - would navigate to login');
}

console.log('\n3. Testing with expired token...');
const expiredToken = jwt.sign(
  { id: 1, name: 'Dr. Smith', role: 'Teacher' },
  'lmssecretkey',
  { expiresIn: '-1h' } // Expired 1 hour ago
);

try {
  const payload = JSON.parse(atob(expiredToken.split('.')[1]));
  console.log('✅ Expired token decoded in frontend (expected)');
  console.log('   But backend would reject it with 401');
} catch (error) {
  console.log('❌ Error decoding expired token:', error.message);
}

console.log('\n4. Testing with valid token...');
const validToken = jwt.sign(
  { id: 1, name: 'Dr. Smith', role: 'Teacher' },
  'lmssecretkey',
  { expiresIn: '30d' }
);

console.log('✅ Valid token generated successfully');

console.log('\n5. Testing API calls with valid token...');

async function testAPICalls() {
  try {
    // Test courses endpoint
    const coursesRes = await fetch('http://localhost:3003/api/courses/teacher', {
      headers: {
        'Authorization': `Bearer ${validToken}`
      }
    });
    
    console.log('Courses API status:', coursesRes.status);
    
    if (coursesRes.ok) {
      const coursesData = await coursesRes.json();
      console.log(`✅ Courses fetched successfully: ${coursesData.length} courses`);
      
      // Test students endpoint
      if (coursesData.length > 0) {
        const courseId = coursesData[0]._id;
        const studentsRes = await fetch(`http://localhost:3003/api/enroll/students/${courseId}/details`, {
          headers: {
            'Authorization': `Bearer ${validToken}`
          }
        });
        
        console.log('Students API status:', studentsRes.status);
        
        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          console.log(`✅ Students fetched successfully: ${studentsData.length} students`);
        } else {
          console.log('❌ Error fetching students');
        }
      }
    } else {
      console.log('❌ Error fetching courses');
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testAPICalls().then(() => {
  console.log('\n6. Summary:');
  console.log('   - If token is missing -> navigates to login');
  console.log('   - If token is invalid -> navigates to login');
  console.log('   - If token is expired -> backend returns 401 -> navigates to login');
  console.log('   - If token is valid and API works -> dashboard should load');
  console.log('   - If API calls fail for other reasons -> loading state might persist');
  
  console.log('\n💡 Possible causes for persistent loading:');
  console.log('   1. Network connectivity issues');
  console.log('   2. Backend server not responding');
  console.log('   3. Proxy configuration issues');
  console.log('   4. CORS issues');
  console.log('   5. Unexpected errors in async functions that prevent setLoading(false)');
});