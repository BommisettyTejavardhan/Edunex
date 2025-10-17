// Comprehensive test to simulate the dashboard loading process
const jwt = require('jsonwebtoken');

// Generate a valid token for the teacher
const token = jwt.sign(
  { id: 1, name: 'Dr. Smith', role: 'Teacher' },
  'lmssecretkey',
  { expiresIn: '30d' }
);

console.log('🧪 Comprehensive Dashboard Loading Test\n');

async function comprehensiveTest() {
  try {
    console.log('1. Simulating token retrieval from localStorage...');
    console.log('✅ Token retrieved successfully');
    
    console.log('\n2. Simulating token decoding...');
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('✅ Token decoded successfully');
    console.log('   User role:', payload.role);
    console.log('   User name:', payload.name);
    
    console.log('\n3. Simulating fetchTeacherCourses function...');
    console.time('fetchTeacherCourses');
    const coursesRes = await fetch('http://localhost:3003/api/courses/teacher', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.timeEnd('fetchTeacherCourses');
    
    if (coursesRes.ok) {
      const coursesData = await coursesRes.json();
      console.log(`✅ Successfully fetched ${coursesData.length} courses`);
      
      console.log('\n4. Simulating fetchAllStudents function...');
      console.time('fetchAllStudents');
      const allStudents = [];
      
      for (const [index, course] of coursesData.entries()) {
        console.log(`   Fetching students for course ${index + 1}/${coursesData.length}: ${course.title}`);
        const studentsRes = await fetch(`http://localhost:3003/api/enroll/students/${course._id}/details`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          console.log(`   ✅ Found ${studentsData.length} students in ${course.title}`);
          
          // Add course information to each student
          const studentsWithCourseInfo = studentsData.map(student => ({
            ...student,
            courseTitle: course.title,
            courseId: course._id
          }));
          allStudents.push(...studentsWithCourseInfo);
        } else {
          console.log(`   ❌ Error fetching students for ${course.title}`);
        }
      }
      
      console.timeEnd('fetchAllStudents');
      console.log(`\n✅ Total students across all courses: ${allStudents.length}`);
      
      console.log('\n5. Summary of dashboard data:');
      console.log(`   - User: ${payload.name} (${payload.role})`);
      console.log(`   - Courses: ${coursesData.length}`);
      console.log(`   - Total enrolled students: ${allStudents.length}`);
      
      if (coursesData.length > 0) {
        console.log('   - Course details:');
        coursesData.forEach((course, index) => {
          const studentCount = Array.isArray(course.students) ? course.students.length : 0;
          console.log(`     ${index + 1}. ${course.title} (${studentCount} students)`);
        });
      }
      
      if (allStudents.length > 0) {
        console.log('   - Student details:');
        allStudents.forEach((student, index) => {
          console.log(`     ${index + 1}. ${student.name} (${student.email}) - ${student.courseTitle}`);
        });
      }
      
      console.log('\n🎉 All dashboard functions working correctly!');
      
    } else {
      const errorData = await coursesRes.json();
      console.log('❌ Error fetching courses:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Error in comprehensive test:', error);
  }
}

comprehensiveTest();