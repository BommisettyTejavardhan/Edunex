const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testUpdateCourse() {
  console.log('Testing course update functionality...');
  
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
  
  // 4. Update the course name to "Python"
  console.log('\n4. Updating course name to "Python"...');
  response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${teacherToken}`
    },
    body: JSON.stringify({
      title: 'Python',
      description: 'This is a test course',
      duration: 10
    })
  });
  
  data = await response.json();
  console.log('Course update response:', data);
  
  // 5. Check if update was successful
  if (response.ok) {
    console.log('\n✅ SUCCESS: Course name updated to "Python"!');
    console.log('Updated course details:', data);
  } else {
    console.log('\n❌ FAILED: Course update failed');
    console.log('Error:', data);
  }
  
  // 6. Verify the course name is "Python" by fetching it
  console.log('\n5. Verifying course name is "Python"...');
  response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${teacherToken}`
    }
  });
  
  data = await response.json();
  console.log('Course details after update:', data);
  
  if (data.title === 'Python') {
    console.log('\n✅ SUCCESS: Course name is confirmed as "Python"!');
  } else {
    console.log('\n❌ FAILED: Course name is not "Python"');
  }
  
  // 7. Get all courses to verify the update is reflected in the list
  console.log('\n6. Getting all courses to verify update...');
  response = await fetch('http://localhost:5000/api/courses', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${teacherToken}`
    }
  });
  
  data = await response.json();
  console.log('All courses:', data);
  
  const updatedCourse = data.find(course => course._id == courseId);
  if (updatedCourse && updatedCourse.title === 'Python') {
    console.log('\n✅ SUCCESS: Course name is "Python" in the course list!');
  } else {
    console.log('\n❌ FAILED: Course name is not "Python" in the course list');
  }
}

testUpdateCourse().catch(console.error);