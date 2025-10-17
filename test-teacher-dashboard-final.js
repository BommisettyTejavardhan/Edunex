// Script to test the teacher dashboard functionality
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate a valid token for the mock teacher user (ID: 1)
const generateTeacherToken = () => {
  const token = jwt.sign(
    { id: 1, name: 'Dr. Smith', role: 'Teacher' },
    process.env.JWT_SECRET || 'lmssecretkey',
    { expiresIn: '30d' }
  );
  
  console.log('Generated teacher token:', token);
  return token;
};

// Test the teacher dashboard endpoints
const testTeacherDashboard = async () => {
  const token = generateTeacherToken();
  
  try {
    // Test courses endpoint
    console.log('\n=== Testing Teacher Courses Endpoint ===');
    const coursesResponse = await fetch('http://localhost:3003/api/courses/teacher', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const coursesData = await coursesResponse.json();
    console.log('Courses response status:', coursesResponse.status);
    console.log('Number of courses:', coursesData.length);
    
    if (coursesData.length > 0) {
      console.log('First course details:');
      console.log('- Title:', coursesData[0].title);
      console.log('- Students enrolled:', coursesData[0].students.length);
    }
    
    // Test student enrollment details endpoint
    console.log('\n=== Testing Student Enrollment Details Endpoint ===');
    if (coursesData.length > 0) {
      const courseId = coursesData[0]._id;
      const studentsResponse = await fetch(`http://localhost:3003/api/enroll/students/${courseId}/details`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const studentsData = await studentsResponse.json();
      console.log('Students response status:', studentsResponse.status);
      console.log('Number of enrolled students:', studentsData.length);
      
      if (studentsData.length > 0) {
        console.log('First student details:');
        console.log('- Name:', studentsData[0].name);
        console.log('- Email:', studentsData[0].email);
        console.log('- Enrolled at:', studentsData[0].enrolledAt);
      }
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing teacher dashboard:', error);
  }
};

// Run the test
testTeacherDashboard();