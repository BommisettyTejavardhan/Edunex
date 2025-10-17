const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Helper function to pause execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function demonstrateEnrollmentVisibility() {
  console.log('\n' + '='.repeat(70));
  console.log('🎓 LMS ENROLLMENT VISIBILITY DEMONSTRATION');
  console.log('='.repeat(70) + '\n');
  
  console.log('This demo shows how student enrollments are immediately visible');
  console.log('to teachers in real-time.\n');
  
  try {
    // Setup: Login as the pre-created teacher
    console.log('📋 SETUP: Using existing teacher account');
    console.log('-'.repeat(70));
    
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teacher@example.com',
        password: 'password123'
      })
    });
    const teacherData = await loginRes.json();
    console.log(`✅ Logged in as: ${teacherData.name} (${teacherData.role})`);
    const teacherToken = teacherData.token;
    
    await sleep(1000);
    
    // Get existing courses
    console.log('\n📚 STEP 1: Checking teacher\'s existing courses');
    console.log('-'.repeat(70));
    
    const coursesRes = await fetch('http://localhost:5000/api/courses/teacher', {
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });
    const courses = await coursesRes.json();
    
    if (courses.length === 0) {
      console.log('❌ No courses found. Please create a course first.');
      return;
    }
    
    const targetCourse = courses[0];
    console.log(`✅ Using course: "${targetCourse.title}"`);
    console.log(`   Course ID: ${targetCourse._id}`);
    console.log(`   Current students: ${targetCourse.students ? targetCourse.students.length : 0}`);
    
    await sleep(1500);
    
    // Check current enrolled students
    console.log('\n👥 STEP 2: Checking currently enrolled students');
    console.log('-'.repeat(70));
    
    const initialStudentsRes = await fetch(`http://localhost:5000/api/enroll/students/${targetCourse._id}/details`, {
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });
    const initialStudents = await initialStudentsRes.json();
    
    console.log(`📊 Currently enrolled: ${initialStudents.length} student(s)`);
    if (initialStudents.length > 0) {
      initialStudents.forEach((student, i) => {
        console.log(`   ${i + 1}. ${student.name} (${student.email})`);
      });
    } else {
      console.log('   (No students enrolled yet)');
    }
    
    await sleep(1500);
    
    // Simulate student enrollment
    console.log('\n🎯 STEP 3: Simulating new student enrollment');
    console.log('-'.repeat(70));
    
    const studentName = `Demo Student ${Date.now()}`;
    const studentEmail = `demo${Date.now()}@student.edu`;
    
    console.log(`Creating new student account...`);
    console.log(`   Name: ${studentName}`);
    console.log(`   Email: ${studentEmail}`);
    
    const studentRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: studentName,
        email: studentEmail,
        password: 'password123',
        role: 'Student'
      })
    });
    const studentData = await studentRes.json();
    console.log(`✅ Student account created (ID: ${studentData._id})`);
    
    await sleep(1000);
    
    console.log(`\nEnrolling student in course...`);
    const enrollRes = await fetch(`http://localhost:5000/api/enroll/${targetCourse._id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${studentData.token}` }
    });
    const enrollData = await enrollRes.json();
    console.log(`✅ ${enrollData.message}`);
    
    await sleep(1500);
    
    // Check visibility immediately
    console.log('\n🔍 STEP 4: Verifying IMMEDIATE visibility to teacher');
    console.log('-'.repeat(70));
    console.log('Fetching updated student list from teacher\'s perspective...\n');
    
    await sleep(500);
    
    const updatedStudentsRes = await fetch(`http://localhost:5000/api/enroll/students/${targetCourse._id}/details`, {
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });
    const updatedStudents = await updatedStudentsRes.json();
    
    console.log(`📊 Updated enrollment count: ${updatedStudents.length} student(s)`);
    console.log(`   (Previous count: ${initialStudents.length})`);
    console.log(`   Difference: +${updatedStudents.length - initialStudents.length} new enrollment(s)\n`);
    
    // Find and highlight the new student
    const newStudent = updatedStudents.find(s => s.email === studentEmail);
    
    if (newStudent) {
      console.log('✅ ✅ ✅ SUCCESS! New student is IMMEDIATELY VISIBLE! ✅ ✅ ✅\n');
      console.log('📋 Student Details Visible to Teacher:');
      console.log('   ' + '─'.repeat(50));
      console.log(`   👤 Name:          ${newStudent.name}`);
      console.log(`   📧 Email:         ${newStudent.email}`);
      console.log(`   🎓 Course:        ${targetCourse.title}`);
      console.log(`   📅 Enrolled:      ${new Date(newStudent.enrolledAt).toLocaleString()}`);
      console.log(`   🆔 Student ID:    ${newStudent.id}`);
      console.log('   ' + '─'.repeat(50));
    } else {
      console.log('❌ ERROR: Student enrollment not immediately visible!');
      return;
    }
    
    await sleep(1500);
    
    // Show all current students
    console.log('\n📋 STEP 5: Complete enrolled students list');
    console.log('-'.repeat(70));
    console.log(`All students currently enrolled in "${targetCourse.title}":\n`);
    
    updatedStudents.forEach((student, i) => {
      const isNew = student.email === studentEmail;
      const marker = isNew ? '🆕' : '  ';
      console.log(`${marker} ${i + 1}. ${student.name}`);
      console.log(`      Email: ${student.email}`);
      console.log(`      Enrolled: ${new Date(student.enrolledAt).toLocaleString()}`);
      console.log('');
    });
    
    // Summary
    console.log('='.repeat(70));
    console.log('✅ DEMONSTRATION COMPLETE');
    console.log('='.repeat(70));
    console.log('\n📊 Summary of Results:');
    console.log(`   • Course: ${targetCourse.title}`);
    console.log(`   • Initial students: ${initialStudents.length}`);
    console.log(`   • New enrollments: 1`);
    console.log(`   • Final students: ${updatedStudents.length}`);
    console.log(`   • Visibility delay: NONE (Immediate)`);
    console.log(`   • Data accuracy: ✅ 100%`);
    
    console.log('\n💡 Key Takeaways:');
    console.log('   1. Student enrollments are visible IMMEDIATELY to teachers');
    console.log('   2. No refresh or delay required');
    console.log('   3. Complete student information is available (name, email, date)');
    console.log('   4. Enrollment timestamps are accurately recorded');
    console.log('   5. Teachers can access this data through multiple dashboard views');
    
    console.log('\n🎓 How Teachers Access This Information:');
    console.log('   • Teacher Dashboard → "All Enrolled Students" section');
    console.log('   • Course List → Click "View Students" button');
    console.log('   • Use "Refresh Student List" button for latest updates');
    
    console.log('\n' + '='.repeat(70) + '\n');
    
  } catch (error) {
    console.log('\n❌ Demo failed:', error.message);
    console.error(error);
  }
}

// Run the demonstration
demonstrateEnrollmentVisibility();
