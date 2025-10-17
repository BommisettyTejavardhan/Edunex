// Script to enroll the valid student in a course
const studentToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJpYXQiOjE3NjA2Mjc1NjcsImV4cCI6MTc2MzIxOTU2N30.l3Dm5tfR5UhmxZ8d0WhIbTJUwbJGzODWMPP-FshBgh0";

async function enrollStudent() {
  try {
    // First, get the teacher's courses
    console.log('Getting teacher courses...');
    
    // Generate teacher token
    const jwt = require('jsonwebtoken');
    const teacherToken = jwt.sign(
      { id: 1, name: 'Dr. Smith', role: 'Teacher' },
      'lmssecretkey',
      { expiresIn: '30d' }
    );
    
    const coursesResponse = await fetch('http://localhost:3003/api/courses/teacher', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!coursesResponse.ok) {
      throw new Error(`Failed to get courses: ${coursesResponse.status}`);
    }
    
    const courses = await coursesResponse.json();
    console.log(`Found ${courses.length} courses`);
    
    if (courses.length === 0) {
      console.log('No courses found');
      return;
    }
    
    // Enroll student in the first course
    const courseId = courses[0]._id;
    console.log(`Enrolling student in course: ${courses[0].title}`);
    
    const enrollResponse = await fetch(`http://localhost:3003/api/enroll/${courseId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${studentToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (enrollResponse.ok) {
      console.log('Student enrolled successfully!');
    } else {
      const errorData = await enrollResponse.json();
      console.log('Failed to enroll student:', errorData);
    }
    
    // Test the student details endpoint
    console.log('Testing student details endpoint...');
    const studentsResponse = await fetch(`http://localhost:3003/api/enroll/students/${courseId}/details`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (studentsResponse.ok) {
      const students = await studentsResponse.json();
      console.log(`Found ${students.length} enrolled students`);
      console.log('Student details:', JSON.stringify(students, null, 2));
    } else {
      const errorData = await studentsResponse.json();
      console.log('Failed to get student details:', errorData);
    }
  } catch (error) {
    console.error('Error enrolling students:', error);
  }
}

enrollStudent();