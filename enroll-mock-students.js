// Script to enroll mock students in courses for testing
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate a valid token for the mock teacher user (ID: 1)
const generateTeacherToken = () => {
  return jwt.sign(
    { id: 1, name: 'Dr. Smith', role: 'Teacher' },
    process.env.JWT_SECRET || 'lmssecretkey',
    { expiresIn: '30d' }
  );
};

// Login existing students to get tokens
const loginStudents = async () => {
  const students = [
    { email: 'john.smith@student.edu', password: 'password123' },
    { email: 'emma.wilson@student.edu', password: 'password123' },
    { email: 'michael.brown@student.edu', password: 'password123' }
  ];
  
  const studentTokens = [];
  
  for (const studentData of students) {
    try {
      // Login the student
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });
      
      if (loginResponse.ok) {
        const loggedInStudent = await loginResponse.json();
        console.log(`✅ Logged in ${loggedInStudent.name}`);
        studentTokens.push({
          id: loggedInStudent._id,
          name: loggedInStudent.name,
          email: loggedInStudent.email,
          token: loggedInStudent.token
        });
      } else {
        const errorData = await loginResponse.json();
        console.log(`❌ Failed to login ${studentData.email}: ${errorData.message}`);
      }
    } catch (error) {
      console.error(`Error logging in ${studentData.email}:`, error);
    }
  }
  
  return studentTokens;
};

// Enroll students in courses
const enrollStudents = async () => {
  const teacherToken = generateTeacherToken();
  const students = await loginStudents();
  
  if (students.length === 0) {
    console.log('No students were logged in successfully');
    return;
  }
  
  try {
    // Get teacher's courses
    console.log('Fetching teacher courses...');
    const coursesResponse = await fetch('http://localhost:5000/api/courses/teacher', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const courses = await coursesResponse.json();
    console.log(`Found ${courses.length} courses`);
    
    if (courses.length === 0) {
      console.log('No courses found for teacher');
      return;
    }
    
    // Enroll each student in the first course
    const courseId = courses[0]._id;
    console.log(`Enrolling students in course: ${courses[0].title}`);
    
    for (const student of students) {
      console.log(`Enrolling ${student.name}...`);
      
      const enrollResponse = await fetch(`http://localhost:5000/api/enroll/${courseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${student.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (enrollResponse.ok) {
        console.log(`✅ ${student.name} enrolled successfully`);
      } else {
        const errorData = await enrollResponse.json();
        console.log(`❌ Failed to enroll ${student.name}: ${errorData.message}`);
      }
    }
    
    // Verify enrollment by fetching student details
    console.log('\nVerifying enrollment...');
    const studentsResponse = await fetch(`http://localhost:5000/api/enroll/students/${courseId}/details`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const enrolledStudents = await studentsResponse.json();
    console.log(`Enrolled students: ${enrolledStudents.length}`);
    enrolledStudents.forEach(student => {
      console.log(`- ${student.name} (${student.email})`);
    });
    
  } catch (error) {
    console.error('Error enrolling students:', error);
  }
};

// Run the enrollment
enrollStudents();