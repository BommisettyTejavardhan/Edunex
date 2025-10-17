// Test script to verify API endpoints are working
const jwt = require('jsonwebtoken');

// Generate a valid token for the teacher
const token = jwt.sign(
  { id: 1, name: 'Dr. Smith', role: 'Teacher' },
  'lmssecretkey',
  { expiresIn: '30d' }
);

console.log('Generated teacher token:', token);

async function testAPIEndpoints() {
  try {
    console.log('\n=== Testing /api/courses/teacher endpoint ===');
    const coursesResponse = await fetch('http://localhost:5000/api/courses/teacher', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Courses response status:', coursesResponse.status);
    
    if (coursesResponse.ok) {
      const coursesData = await coursesResponse.json();
      console.log(`✅ Successfully fetched ${coursesData.length} courses`);
      if (coursesData.length > 0) {
        console.log('First course:', coursesData[0].title);
      }
    } else {
      const errorData = await coursesResponse.json();
      console.log('❌ Error fetching courses:', errorData);
    }
    
    console.log('\n=== Testing /api/enroll/students/:id/details endpoint ===');
    // First get courses to get a course ID
    const coursesRes = await fetch('http://localhost:5000/api/courses/teacher', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (coursesRes.ok) {
      const coursesData = await coursesRes.json();
      if (coursesData.length > 0) {
        const courseId = coursesData[0]._id;
        console.log(`Testing with course ID: ${courseId}`);
        
        const studentsResponse = await fetch(`http://localhost:5000/api/enroll/students/${courseId}/details`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Students response status:', studentsResponse.status);
        
        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json();
          console.log(`✅ Successfully fetched ${studentsData.length} students`);
          if (studentsData.length > 0) {
            console.log('First student:', studentsData[0].name);
          }
        } else {
          const errorData = await studentsResponse.json();
          console.log('❌ Error fetching students:', errorData);
        }
      } else {
        console.log('No courses found to test student endpoint');
      }
    } else {
      console.log('Failed to fetch courses for student endpoint test');
    }
    
  } catch (error) {
    console.error('Error testing API endpoints:', error);
  }
}

testAPIEndpoints();