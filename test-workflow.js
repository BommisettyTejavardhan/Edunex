const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testWorkflow() {
  console.log('Testing LMS workflow...');
  
  // 1. Register as a teacher
  console.log('\n1. Registering as a teacher...');
  let response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Teacher',
      email: 'teacher@test.com',
      password: 'password123',
      role: 'Teacher'
    })
  });
  
  let data = await response.json();
  console.log('Teacher registration response:', data);
  
  // 2. Login as teacher
  console.log('\n2. Logging in as teacher...');
  response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'teacher@test.com',
      password: 'password123'
    })
  });
  
  data = await response.json();
  console.log('Teacher login response:', data);
  const teacherToken = data.token;
  
  // 3. Create a course as teacher
  console.log('\n3. Creating a course as teacher...');
  response = await fetch('http://localhost:5000/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${teacherToken}`
    },
    body: JSON.stringify({
      title: 'Test Course',
      description: 'This is a test course',
      duration: 10
    })
  });
  
  data = await response.json();
  console.log('Course creation response:', data);
  const courseId = data._id;
  
  // 4. Register as a student
  console.log('\n4. Registering as a student...');
  response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Student',
      email: 'student@test.com',
      password: 'password123',
      role: 'Student'
    })
  });
  
  data = await response.json();
  console.log('Student registration response:', data);
  
  // 5. Login as student
  console.log('\n5. Logging in as student...');
  response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@test.com',
      password: 'password123'
    })
  });
  
  data = await response.json();
  console.log('Student login response:', data);
  const studentToken = data.token;
  
  // 6. Fetch courses as student
  console.log('\n6. Fetching courses as student...');
  response = await fetch('http://localhost:5000/api/courses', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${studentToken}`
    }
  });
  
  data = await response.json();
  console.log('Courses for student:', data);
  
  // 7. Check if the created course is visible to student
  const courseFound = data.find(course => course._id == courseId);
  if (courseFound) {
    console.log('\n✅ SUCCESS: Course created by teacher is visible to student!');
    console.log('Course details:', courseFound);
  } else {
    console.log('\n❌ FAILED: Course not found for student');
  }
  
  // 8. Fetch courses as teacher
  console.log('\n7. Fetching courses as teacher...');
  response = await fetch('http://localhost:5000/api/courses', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${teacherToken}`
    }
  });
  
  data = await response.json();
  console.log('Courses for teacher:', data);
  
  // 9. Check if the created course is visible to teacher
  const teacherCourseFound = data.find(course => course._id == courseId);
  if (teacherCourseFound) {
    console.log('\n✅ SUCCESS: Course created by teacher is visible to teacher!');
    console.log('Course details:', teacherCourseFound);
  } else {
    console.log('\n❌ FAILED: Course not found for teacher');
  }
}

testWorkflow().catch(console.error);