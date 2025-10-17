const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAssignments() {
  console.log('Testing assignment functionality...');
  
  // 1. Login as teacher (using existing test user)
  console.log('\n1. Logging in as teacher...');
  let response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'teacher@example.com',
      password: 'password123'
    })
  });
  
  let data = await response.json();
  console.log('Teacher login response:', data);
  const teacherToken = data.token;
  
  // Get the correct course ID
  const courseId = 1760692781616; // Correct course ID from our test
  
  // 2. Create an assignment as teacher
  console.log('\n2. Creating an assignment as teacher...');
  response = await fetch('http://localhost:5000/api/assignments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${teacherToken}`
    },
    body: JSON.stringify({
      title: 'Test Assignment',
      description: 'This is a test assignment',
      courseId: courseId,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    })
  });
  
  data = await response.json();
  console.log('Assignment creation response:', data);
  const assignmentId = data._id;
  
  // 3. Login as student (using existing test user)
  console.log('\n3. Logging in as student...');
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
  
  // 4. Submit assignment as student
  console.log('\n4. Submitting assignment as student...');
  response = await fetch('http://localhost:5000/api/submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      assignmentId: assignmentId,
      content: 'This is my assignment submission.'
    })
  });
  
  data = await response.json();
  console.log('Assignment submission response:', data);
  
  // 5. Check if submission was successful
  if (response.ok) {
    console.log('\n✅ SUCCESS: Assignment submitted successfully!');
  } else {
    console.log('\n❌ FAILED: Assignment submission failed');
    console.log('Error:', data);
    return; // Exit if submission failed
  }
  
  // 6. Get student's submissions
  console.log('\n5. Getting student submissions...');
  response = await fetch('http://localhost:5000/api/submissions/my', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${studentToken}`
    }
  });
  
  data = await response.json();
  console.log('Student submissions:', data);
  
  // 7. Login as teacher again to check submissions
  console.log('\n6. Logging in as teacher again...');
  response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'teacher@example.com',
      password: 'password123'
    })
  });
  
  data = await response.json();
  const teacherToken2 = data.token;
  
  // 8. Get submissions for assignment as teacher
  console.log('\n7. Getting submissions for assignment as teacher...');
  response = await fetch(`http://localhost:5000/api/submissions/assignment/${assignmentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${teacherToken2}`
    }
  });
  
  data = await response.json();
  console.log('Assignment submissions:', data);
  
  // 9. Grade the submission
  console.log('\n8. Grading the submission...');
  if (data.length > 0) {
    const submissionId = data[0]._id; // Get the first submission
    response = await fetch(`http://localhost:5000/api/submissions/${submissionId}/grade`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${teacherToken2}`
      },
      body: JSON.stringify({
        grade: 85
      })
    });
    
    data = await response.json();
    console.log('Grading response:', data);
    
    // 10. Check if grading was successful
    if (response.ok) {
      console.log('\n✅ SUCCESS: Assignment graded successfully!');
    } else {
      console.log('\n❌ FAILED: Assignment grading failed');
      console.log('Error:', data);
    }
  } else {
    console.log('\n❌ FAILED: No submissions found to grade');
  }
}

testAssignments().catch(console.error);