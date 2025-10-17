const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testEnrollment() {
  console.log('Testing enrollment functionality...');
  
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
  
  // 6. Enroll in course as student
  console.log('\n6. Enrolling in course as student...');
  response = await fetch(`http://localhost:5000/api/enroll/${courseId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${studentToken}`
    }
  });
  
  data = await response.json();
  console.log('Enrollment response:', data);
  
  // 7. Check if enrollment was successful
  if (response.ok) {
    console.log('\n✅ SUCCESS: Student enrolled in course successfully!');
  } else {
    console.log('\n❌ FAILED: Enrollment failed');
    console.log('Error:', data);
  }
  
  // 8. Get enrolled courses for student
  console.log('\n7. Getting enrolled courses for student...');
  response = await fetch('http://localhost:5000/api/enroll/mycourses', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${studentToken}`
    }
  });
  
  data = await response.json();
  console.log('Enrolled courses:', data);
  
  // 9. Check if course appears in enrolled courses
  const enrolledCourse = data.find(course => course._id == courseId);
  if (enrolledCourse) {
    console.log('\n✅ SUCCESS: Course appears in student\'s enrolled courses!');
    console.log('Enrolled course details:', enrolledCourse);
  } else {
    console.log('\n❌ FAILED: Course not found in student\'s enrolled courses');
  }
}

testEnrollment().catch(console.error);