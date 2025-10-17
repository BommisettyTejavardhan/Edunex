const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate a valid token for the mock teacher user (ID: 1)
const generateTeacherToken = () => {
  const token = jwt.sign(
    { id: 1, name: 'Dr. Smith', role: 'Teacher' },
    process.env.JWT_SECRET || 'lmssecretkey',
    { expiresIn: '30d' }
  );
  
  console.log('Generated token:', token);
  console.log('Decoded token:', jwt.decode(token));
  
  return token;
};

// Test the API endpoints
const testAPI = async () => {
  const token = generateTeacherToken();
  
  try {
    // Test courses endpoint
    console.log('\nTesting /api/courses/teacher endpoint...');
    const coursesResponse = await fetch('http://localhost:5000/api/courses/teacher', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const coursesData = await coursesResponse.json();
    console.log('Courses response status:', coursesResponse.status);
    console.log('Courses data:', JSON.stringify(coursesData, null, 2));
    
    // If we have courses, test the enrollment endpoint for the first course
    if (coursesData.length > 0) {
      console.log('\nTesting /api/enroll/students/:id/details endpoint...');
      const courseId = coursesData[0]._id;
      const studentsResponse = await fetch(`http://localhost:5000/api/enroll/students/${courseId}/details`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const studentsData = await studentsResponse.json();
      console.log('Students response status:', studentsResponse.status);
      console.log('Students data:', JSON.stringify(studentsData, null, 2));
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
};

// Run the test
testAPI();