// Script to register students, then enroll them in courses
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Student data to register
const studentsData = [
  { name: 'John Smith', email: 'john.smith@student.edu', password: 'password123', role: 'Student' },
  { name: 'Emma Wilson', email: 'emma.wilson@student.edu', password: 'password123', role: 'Student' },
  { name: 'Michael Brown', email: 'michael.brown@student.edu', password: 'password123', role: 'Student' }
];

// Register students
const registerStudents = async () => {
  const registeredStudents = [];
  
  for (const studentData of studentsData) {
    try {
      console.log(`Registering ${studentData.name}...`);
      
      const registerResponse = await fetch('http://localhost:3003/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });
      
      if (registerResponse.ok) {
        const registeredStudent = await registerResponse.json();
        console.log(`✅ Registered ${registeredStudent.name}`);
        registeredStudents.push(registeredStudent);
      } else {
        const errorData = await registerResponse.json();
        console.log(`❌ Failed to register ${studentData.name}: ${errorData.message}`);
        
        // If user already exists, try to login
        if (errorData.message.includes('User already exists')) {
          console.log(`Trying to login ${studentData.name}...`);
          const loginResponse = await fetch('http://localhost:3003/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: studentData.email,
              password: studentData.password
            })
          });
          
          if (loginResponse.ok) {
            const loggedInStudent = await loginResponse.json();
            console.log(`✅ Logged in ${loggedInStudent.name}`);
            registeredStudents.push(loggedInStudent);
          } else {
            const loginError = await loginResponse.json();
            console.log(`❌ Failed to login ${studentData.name}: ${loginError.message}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error with ${studentData.name}:`, error);
    }
  }
  
  return registeredStudents;
};

// Enroll students in courses
const enrollStudents = async (students) => {
  if (students.length === 0) {
    console.log('No students to enroll');
    return;
  }
  
  // Generate teacher token
  const teacherToken = jwt.sign(
    { id: 1, name: 'Dr. Smith', role: 'Teacher' },
    process.env.JWT_SECRET || 'lmssecretkey',
    { expiresIn: '30d' }
  );
  
  try {
    // Get teacher's courses
    console.log('Fetching teacher courses...');
    const coursesResponse = await fetch('http://localhost:3003/api/courses/teacher', {
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
      
      const enrollResponse = await fetch(`http://localhost:3003/api/enroll/${courseId}`, {
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
    const studentsResponse = await fetch(`http://localhost:3003/api/enroll/students/${courseId}/details`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const enrolledStudents = await studentsResponse.json();
    console.log(`Enrolled students: ${enrolledStudents.length}`);
    enrolledStudents.forEach(student => {
      console.log(`- ${student.name} (${student.email}) enrolled at ${student.enrolledAt}`);
    });
    
  } catch (error) {
    console.error('Error enrolling students:', error);
  }
};

// Main function
const main = async () => {
  console.log('Setting up students and enrolling them in courses...\n');
  
  // Register students
  const students = await registerStudents();
  
  // Enroll students in courses
  await enrollStudents(students);
  
  console.log('\n✅ Setup complete!');
};

// Run the script
main();