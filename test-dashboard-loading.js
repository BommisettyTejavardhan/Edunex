// Test to diagnose the dashboard loading issue
const jwt = require('jsonwebtoken');

// Generate a valid token for the teacher
const token = jwt.sign(
  { id: 1, name: 'Dr. Smith', role: 'Teacher' },
  'lmssecretkey',
  { expiresIn: '30d' }
);

console.log('Testing dashboard loading issue...\n');

async function testDashboardLoading() {
  try {
    console.log('1. Testing token generation...');
    console.log('✅ Token generated successfully');
    
    console.log('\n2. Testing API connectivity...');
    
    // Test the courses endpoint
    const coursesResponse = await fetch('http://localhost:3003/api/courses/teacher', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Courses API response status:', coursesResponse.status);
    
    if (coursesResponse.ok) {
      const coursesData = await coursesResponse.json();
      console.log(`✅ Successfully fetched ${coursesData.length} courses`);
      
      // Test the students endpoint for the first course
      if (coursesData.length > 0) {
        const firstCourse = coursesData[0];
        console.log(`\n3. Testing student data for course: ${firstCourse.title}`);
        
        const studentsResponse = await fetch(`http://localhost:3003/api/enroll/students/${firstCourse._id}/details`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Students API response status:', studentsResponse.status);
        
        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json();
          console.log(`✅ Successfully fetched ${studentsData.length} students`);
        } else {
          const errorData = await studentsResponse.json();
          console.log('❌ Error fetching students:', errorData);
        }
      }
    } else {
      const errorData = await coursesResponse.json();
      console.log('❌ Error fetching courses:', errorData);
      
      // If it's an auth error, that might explain the loading issue
      if (coursesResponse.status === 401) {
        console.log('🔑 This suggests a token authentication issue which could cause the dashboard to remain in loading state');
      }
    }
    
    console.log('\n4. Testing frontend proxy connection...');
    // Test if frontend can connect to backend through proxy
    try {
      const proxyResponse = await fetch('http://localhost:3000/api/courses/teacher', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Proxy connection status:', proxyResponse.status);
      if (proxyResponse.ok) {
        console.log('✅ Frontend proxy connection working');
      } else {
        console.log('❌ Frontend proxy connection failed');
      }
    } catch (proxyError) {
      console.log('❌ Error testing proxy connection:', proxyError.message);
    }
    
  } catch (error) {
    console.error('❌ Error in dashboard loading test:', error);
  }
}

testDashboardLoading();