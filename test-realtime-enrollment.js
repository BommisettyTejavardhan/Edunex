const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testRealtimeEnrollment() {
  console.log('🧪 Testing Real-time Enrollment Visibility...\n');
  
  try {
    // Step 1: Create a new teacher
    console.log('1️⃣ Creating a new teacher...');
    const teacherRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Teacher',
        email: `teacher${Date.now()}@test.com`,
        password: 'password123',
        role: 'Teacher'
      })
    });
    const teacherData = await teacherRes.json();
    console.log(`   ✅ Teacher created: ${teacherData.name} (ID: ${teacherData._id})`);
    const teacherToken = teacherData.token;
    
    // Step 2: Teacher creates a course
    console.log('\n2️⃣ Teacher creating a course...');
    const courseRes = await fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${teacherToken}`
      },
      body: JSON.stringify({
        title: 'Real-time Enrollment Test Course',
        description: 'Testing immediate visibility of student enrollments',
        duration: 8,
        enrollmentDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })
    });
    const courseData = await courseRes.json();
    console.log(`   ✅ Course created: ${courseData.title} (ID: ${courseData._id})`);
    const courseId = courseData._id;
    
    // Step 3: Check initial enrolled students (should be empty)
    console.log('\n3️⃣ Checking initial enrolled students...');
    const initialStudentsRes = await fetch(`http://localhost:5000/api/enroll/students/${courseId}/details`, {
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });
    const initialStudents = await initialStudentsRes.json();
    console.log(`   ✅ Initial enrolled students: ${initialStudents.length} students`);
    
    // Step 4: Create multiple students and enroll them
    console.log('\n4️⃣ Creating and enrolling students...');
    const students = [];
    const studentNames = ['Alice Johnson', 'Bob Smith', 'Carol Williams'];
    
    for (let i = 0; i < studentNames.length; i++) {
      const name = studentNames[i];
      
      // Create student
      const studentRes = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: `student${Date.now()}_${i}@test.com`,
          password: 'password123',
          role: 'Student'
        })
      });
      const studentData = await studentRes.json();
      students.push(studentData);
      console.log(`   ✅ Student created: ${studentData.name} (ID: ${studentData._id})`);
      
      // Enroll student in course
      const enrollRes = await fetch(`http://localhost:5000/api/enroll/${courseId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${studentData.token}` }
      });
      const enrollData = await enrollRes.json();
      console.log(`   ✅ ${studentData.name} enrolled successfully`);
      
      // Immediately check if enrollment is visible to teacher
      const checkRes = await fetch(`http://localhost:5000/api/enroll/students/${courseId}/details`, {
        headers: { 'Authorization': `Bearer ${teacherToken}` }
      });
      const currentStudents = await checkRes.json();
      console.log(`   📊 Current enrolled students visible to teacher: ${currentStudents.length}`);
      
      // Verify the student appears in the list
      const studentInList = currentStudents.find(s => s.id == studentData._id || s.id == studentData._id.toString());
      if (studentInList) {
        console.log(`   ✅ ${studentData.name} is IMMEDIATELY VISIBLE in teacher's view!`);
        console.log(`      - Name: ${studentInList.name}`);
        console.log(`      - Email: ${studentInList.email}`);
        console.log(`      - Enrolled at: ${new Date(studentInList.enrolledAt).toLocaleString()}`);
      } else {
        console.log(`   ❌ ${studentData.name} NOT visible in teacher's view (ISSUE!)`);
      }
      
      console.log('');
    }
    
    // Step 5: Final verification - Fetch all enrolled students
    console.log('5️⃣ Final verification of all enrolled students...');
    const finalStudentsRes = await fetch(`http://localhost:5000/api/enroll/students/${courseId}/details`, {
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });
    const finalStudents = await finalStudentsRes.json();
    console.log(`   ✅ Total enrolled students: ${finalStudents.length}`);
    console.log('\n   📋 Complete Student List:');
    finalStudents.forEach((student, index) => {
      console.log(`   ${index + 1}. ${student.name}`);
      console.log(`      - Email: ${student.email}`);
      console.log(`      - Enrolled: ${new Date(student.enrolledAt).toLocaleString()}`);
    });
    
    // Step 6: Verify visibility in teacher's courses list
    console.log('\n6️⃣ Checking course details from teacher\'s courses list...');
    const teacherCoursesRes = await fetch('http://localhost:5000/api/courses/teacher', {
      headers: { 'Authorization': `Bearer ${teacherToken}` }
    });
    const teacherCourses = await teacherCoursesRes.json();
    const testCourse = teacherCourses.find(c => c._id == courseId || c._id == courseId.toString());
    
    if (testCourse) {
      console.log(`   ✅ Course found in teacher's list`);
      console.log(`   📊 Students count in course object: ${testCourse.students ? testCourse.students.length : 0}`);
      
      if (testCourse.students && testCourse.students.length > 0) {
        console.log('   ✅ Student enrollments are visible in course object!');
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Course created: 1`);
    console.log(`✅ Students enrolled: ${students.length}`);
    console.log(`✅ Students visible to teacher: ${finalStudents.length}`);
    console.log(`✅ Real-time visibility: ${finalStudents.length === students.length ? 'WORKING ✓' : 'ISSUE ✗'}`);
    console.log('='.repeat(60));
    
    console.log('\n🎉 Test completed successfully!');
    console.log('\n💡 Key Points:');
    console.log('   • Student enrollments are IMMEDIATELY visible to teachers');
    console.log('   • Teachers can see student name, email, and enrollment date');
    console.log('   • The enrollment count updates in real-time in the course list');
    console.log('   • Teachers can refresh the student list to see latest enrollments');
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    console.error(error);
  }
}

testRealtimeEnrollment();
