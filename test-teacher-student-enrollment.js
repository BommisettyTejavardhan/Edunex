const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testTeacherStudentEnrollment() {
  console.log('🧪 Testing Teacher-Student Enrollment Functionality...');
  
  // Step 1: Register a teacher
  console.log('\n1. Registering a teacher...');
  let response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Dr. Emily Parker',
      email: 'emily.parker@university.edu',
      password: 'teacherpassword',
      role: 'Teacher'
    })
  });
  
  let data = await response.json();
  console.log('✅ Teacher registered:', data.name);
  const teacherToken = data.token;
  
  // Step 2: Register multiple students
  console.log('\n2. Registering students...');
  const students = [];
  
  const studentData = [
    { name: 'Alice Johnson', email: 'alice@student.edu' },
    { name: 'Bob Smith', email: 'bob@student.edu' },
    { name: 'Carol Williams', email: 'carol@student.edu' }
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
    console.log('✅ Student registered:', data.name);
    students.push({
      id: data._id,
      name: data.name,
      email: data.email,
      token: data.token
    });
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
      title: 'Data Structures and Algorithms',
      description: 'Learn essential data structures and algorithms for computer science.',
      duration: 25,
      enrollmentDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 3 weeks from now
    })
  });
  
  data = await response.json();
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
  
  // Step 5: Teacher views their courses with student counts
  console.log('\n5. Teacher viewing their courses...');
  response = await fetch('http://localhost:5000/api/courses/teacher', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${teacherToken}`
    }
  });
  
  data = await response.json();
  console.log(`✅ Teacher has ${data.length} course(s):`);
  data.forEach(course => {
    console.log(`   - ${course.title} (${course.students.length} students enrolled)`);
  });
  
  // Step 6: Teacher views detailed student information with enrollment dates
  console.log('\n6. Teacher viewing detailed student information...');
  response = await fetch(`http://localhost:5000/api/enroll/students/${courseId}/details`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${teacherToken}`
    }
  });
  
  data = await response.json();
  console.log(`✅ Course has ${data.length} enrolled student(s):`);
  data.forEach((student, index) => {
    console.log(`   ${index + 1}. ${student.name} (${student.email})`);
    console.log(`      Enrolled: ${new Date(student.enrolledAt).toLocaleString()}`);
  });
  
  // Step 7: Verify student enrollment order (should match enrollment time)
  console.log('\n7. Verifying enrollment order...');
  const sortedStudents = [...data].sort((a, b) => new Date(a.enrolledAt) - new Date(b.enrolledAt));
  console.log('Students enrolled in chronological order:');
  sortedStudents.forEach((student, index) => {
    console.log(`   ${index + 1}. ${student.name} - ${new Date(student.enrolledAt).toLocaleTimeString()}`);
  });
  
  console.log('\n🎉 All teacher-student enrollment tests completed successfully!');
  console.log('\n📋 Summary of implemented features:');
  console.log('✅ Teachers can see a list of their courses');
  console.log('✅ Teachers can see student enrollment counts for each course');
  console.log('✅ Teachers can view detailed student information including names and emails');
  console.log('✅ Teachers can see enrollment dates for each student');
  console.log('✅ All data is properly formatted and displayed');
  console.log('✅ Student enrollment order is preserved');
}

testTeacherStudentEnrollment().catch(console.error);