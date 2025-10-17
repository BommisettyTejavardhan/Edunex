// Test the dashboard functions directly
const jwt = require('jsonwebtoken');

// Generate a valid token for the teacher
const token = jwt.sign(
  { id: 1, name: 'Dr. Smith', role: 'Teacher' },
  'lmssecretkey',
  { expiresIn: '30d' }
);

console.log('Testing dashboard functions...');

async function testDashboardFunctions() {
  try {
    console.log('\n=== Testing fetchTeacherCourses function ===');
    const coursesRes = await fetch('http://localhost:3003/api/courses/teacher', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Courses response status:', coursesRes.status);
    
    if (coursesRes.ok) {
      const coursesData = await coursesRes.json();
      console.log(`✅ Successfully fetched ${coursesData.length} courses`);
      
      console.log('\n=== Testing fetchAllStudents function ===');
      const allStudents = [];
      
      for (const course of coursesData) {
        console.log(`Fetching students for course: ${course.title}`);
        const studentsRes = await fetch(`http://localhost:3003/api/enroll/students/${course._id}/details`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log(`Students response status for ${course.title}:`, studentsRes.status);
        
        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          console.log(`✅ Found ${studentsData.length} students in ${course.title}`);
          
          // Add course information to each student
          const studentsWithCourseInfo = studentsData.map(student => ({
            ...student,
            courseTitle: course.title,
            courseId: course._id
          }));
          allStudents.push(...studentsWithCourseInfo);
        } else {
          console.log(`❌ Error fetching students for ${course.title}`);
        }
      }
      
      console.log(`\n✅ Total students across all courses: ${allStudents.length}`);
      if (allStudents.length > 0) {
        console.log('First student with course info:', {
          name: allStudents[0].name,
          course: allStudents[0].courseTitle
        });
      }
    } else {
      const errorData = await coursesRes.json();
      console.log('❌ Error fetching courses:', errorData);
    }
    
  } catch (error) {
    console.error('Error testing dashboard functions:', error);
  }
}

testDashboardFunctions();