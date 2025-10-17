const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCompleteWorkflow() {
  console.log('🧪 Testing complete LMS workflow...');
  
  // Step 1: Register a teacher
  console.log('\n1. Registering a teacher...');
  let response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Dr. Johnson',
      email: 'johnson@university.edu',
      password: 'teacherpassword',
      role: 'Teacher'
    })
  });
  
  let data = await response.json();
  console.log('✅ Teacher registered:', data.name);
  const teacherToken = data.token;
  
  // Step 2: Register a student
  console.log('\n2. Registering a student...');
  response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alice Smith',
      email: 'alice@student.edu',
      password: 'studentpassword',
      role: 'Student'
    })
  });
  
  data = await response.json();
  console.log('✅ Student registered:', data.name);
  const studentToken = data.token;
  
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
  console.log('✅ Course created:', data.title);
  const courseId = data._id;
  
  // Step 4: Student enrolls in the course
  console.log('\n4. Student enrolling in the course...');
  response = await fetch(`http://localhost:5000/api/enroll/${courseId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${studentToken}`
    }
  });
  
  data = await response.json();
  if (response.ok) {
    console.log('✅ Student enrolled successfully!');
  } else {
    console.log('❌ Enrollment failed:', data.message);
    return;
  }
  
  // Step 5: Student views enrolled courses
  console.log('\n5. Student viewing enrolled courses...');
  response = await fetch('http://localhost:5000/api/enroll/mycourses', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${studentToken}`
    }
  });
  
  data = await response.json();
  console.log(`✅ Student has ${data.length} enrolled course(s):`);
  data.forEach(course => {
    console.log(`   - ${course.title}`);
  });
  
  // Step 6: Teacher creates an assignment
  console.log('\n6. Teacher creating an assignment...');
  response = await fetch('http://localhost:5000/api/assignments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${teacherToken}`
    },
    body: JSON.stringify({
      title: 'Programming Fundamentals Quiz',
      description: 'Complete the quiz on programming fundamentals covered in weeks 1-3.',
      courseId: courseId,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    })
  });
  
  data = await response.json();
  console.log('✅ Assignment created:', data.title);
  const assignmentId = data._id;
  
  // Step 7: Teacher views students in the course
  console.log('\n7. Teacher viewing students in the course...');
  response = await fetch(`http://localhost:5000/api/enroll/students/${courseId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${teacherToken}`
    }
  });
  
  data = await response.json();
  console.log(`✅ Course has ${data.length} enrolled student(s):`);
  data.forEach(student => {
    console.log(`   - ${student.name} (${student.email})`);
  });
  
  // Step 8: Student submits assignment
  console.log('\n8. Student submitting assignment...');
  response = await fetch('http://localhost:5000/api/submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      assignmentId: assignmentId,
      content: 'Here is my completed quiz. I answered all questions to the best of my ability.'
    })
  });
  
  data = await response.json();
  if (response.ok) {
    console.log('✅ Assignment submitted successfully!');
  } else {
    console.log('❌ Submission failed:', data.message);
    return;
  }
  
  // Step 9: Student views their submissions
  console.log('\n9. Student viewing their submissions...');
  response = await fetch('http://localhost:5000/api/submissions/my', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${studentToken}`
    }
  });
  
  data = await response.json();
  console.log(`✅ Student has ${data.length} submission(s):`);
  data.forEach(submission => {
    console.log(`   - ${submission.content.substring(0, 30)}... (Graded: ${submission.graded ? 'Yes' : 'No'})`);
  });
  
  // Step 10: Teacher views assignment submissions
  console.log('\n10. Teacher viewing assignment submissions...');
  response = await fetch(`http://localhost:5000/api/submissions/assignment/${assignmentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${teacherToken}`
    }
  });
  
  data = await response.json();
  console.log(`✅ Assignment has ${data.length} submission(s):`);
  data.forEach(submission => {
    console.log(`   - From ${submission.student}: ${submission.content.substring(0, 30)}...`);
  });
  
  // Step 11: Teacher grades the submission
  console.log('\n11. Teacher grading the submission...');
  const submissionId = data[0]._id;
  response = await fetch(`http://localhost:5000/api/submissions/${submissionId}/grade`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${teacherToken}`
    },
    body: JSON.stringify({
      grade: 92
    })
  });
  
  data = await response.json();
  if (response.ok) {
    console.log(`✅ Submission graded with score: ${data.grade}`);
  } else {
    console.log('❌ Grading failed:', data.message);
    return;
  }
  
  console.log('\n🎉 All tests completed successfully!');
  console.log('\n📋 Summary of implemented features:');
  console.log('✅ As a student, I can enroll in a course');
  console.log('✅ As a student, I can see a list of courses I am enrolled in');
  console.log('✅ As a teacher, I can see a list of students enrolled in my course');
  console.log('✅ As a teacher, I can create assignments for a course');
  console.log('✅ As a student, I can submit my assignments to the course');
  console.log('✅ As a teacher, I can see all submissions for a course and grade them');
}

testCompleteWorkflow().catch(console.error);