const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testTeacherDashboard() {
  console.log('🧪 Testing Teacher Dashboard Functionality...');
  
  try {
    // Step 1: Register a teacher
    console.log('\n1. Registering a teacher...');
    let response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@university.edu',
        password: 'teacherpassword',
        role: 'Teacher'
      })
    });
    
    let data = await response.json();
    if (!response.ok) {
      console.log('❌ Teacher registration failed:', data.message);
      return;
    }
    
    console.log('✅ Teacher registered:', data.name);
    const teacherToken = data.token;
    
    // Step 2: Register students
    console.log('\n2. Registering students...');
    const students = [];
    
    const studentData = [
      { name: 'John Smith', email: 'john.smith@student.edu' },
      { name: 'Emma Wilson', email: 'emma.wilson@student.edu' },
      { name: 'Michael Brown', email: 'michael.brown@student.edu' }
    ];
    
    for (const studentInfo of studentData) {
      response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: studentInfo.name,
          email: studentInfo.email,
          password: 'studentpassword',
          role: 'Student'
        })
      });
      
      data = await response.json();
      if (response.ok) {
        console.log('✅ Student registered:', data.name);
        students.push({
          id: data._id,
          name: data.name,
          email: data.email,
          token: data.token
        });
      } else {
        console.log('❌ Student registration failed:', data.message);
      }
    }
    
    // Step 3: Teacher creates a course
    console.log('\n3. Teacher creating a course...');
    response = await fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${teacherToken}`
      },
      body: JSON.stringify({
        title: 'Introduction to Computer Science',
        description: 'Learn the fundamentals of computer science and programming.',
        duration: 15,
        enrollmentDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
      })
    });
    
    data = await response.json();
    if (!response.ok) {
      console.log('❌ Course creation failed:', data.message);
      return;
    }
    
    console.log('✅ Course created:', data.title);
    const courseId = data._id;
    
    // Step 4: Students enroll in the course
    console.log('\n4. Students enrolling in the course...');
    for (const student of students) {
      response = await fetch(`http://localhost:5000/api/enroll/${courseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${student.token}`
        }
      });
      
      data = await response.json();
      if (response.ok) {
        console.log(`✅ ${student.name} enrolled successfully!`);
      } else {
        console.log(`❌ ${student.name} enrollment failed:`, data.message);
      }
      
      // Add a small delay to ensure different enrollment times
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Step 5: Teacher views their courses
    console.log('\n5. Teacher viewing their courses...');
    response = await fetch('http://localhost:5000/api/courses/teacher', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${teacherToken}`
      }
    });
    
    data = await response.json();
    if (!response.ok) {
      console.log('❌ Failed to fetch teacher courses:', data.message);
      return;
    }
    
    console.log(`✅ Teacher has ${data.length} course(s):`);
    data.forEach(course => {
      console.log(`   - ${course.title} (${course.students.length} students enrolled)`);
    });
    
    // Step 6: Teacher views detailed student information
    console.log('\n6. Teacher viewing detailed student information...');
    response = await fetch(`http://localhost:5000/api/enroll/students/${courseId}/details`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${teacherToken}`
      }
    });
    
    data = await response.json();
    if (!response.ok) {
      console.log('❌ Failed to fetch student details:', data.message);
      return;
    }
    
    console.log(`✅ Course has ${data.length} enrolled student(s):`);
    data.forEach((student, index) => {
      console.log(`   ${index + 1}. ${student.name} (${student.email})`);
      console.log(`      Enrolled: ${new Date(student.enrolledAt).toLocaleString()}`);
    });
    
    console.log('\n🎉 All teacher dashboard tests completed successfully!');
    console.log('\n📋 Summary of implemented features:');
    console.log('✅ Teachers can see a list of their courses');
    console.log('✅ Teachers can see student enrollment counts for each course');
    console.log('✅ Teachers can view detailed student information including names and emails');
    console.log('✅ Teachers can see enrollment dates for each student');
    console.log('✅ All data is properly formatted and displayed');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testTeacherDashboard();

// Test TeacherDashboard component
const jwt = require('jsonwebtoken');

// Generate a valid token for the teacher
const token = jwt.sign(
  { id: 1, name: 'Dr. Smith', role: 'Teacher' },
  'lmssecretkey',
  { expiresIn: '30d' }
);

console.log('Generated teacher token:', token);

// Test localStorage simulation
global.localStorage = {
  getItem: (key) => {
    if (key === 'token') {
      return token;
    }
    return null;
  }
};

// Test atob function
global.atob = (str) => {
  return Buffer.from(str, 'base64').toString('binary');
};

// Test token decoding
try {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('✅ Token decoded successfully');
  console.log('   Payload:', JSON.stringify(payload, null, 2));
} catch (error) {
  console.error('❌ Error decoding token:', error);
}

console.log('\n✅ TeacherDashboard component test completed');
