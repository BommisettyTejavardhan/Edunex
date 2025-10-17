// Test frontend fetch requests exactly as they happen in the component
const jwt = require('jsonwebtoken');

// Generate a valid token for the teacher
const token = jwt.sign(
  { id: 1, name: 'Dr. Smith', role: 'Teacher' },
  'lmssecretkey',
  { expiresIn: '30d' }
);

console.log('Testing frontend fetch requests...\n');

async function testFrontendFetch() {
  try {
    console.log('1. Simulating fetchTeacherCourses function...');
    console.log('   Setting coursesLoading to true');
    
    // Simulate the fetch request exactly as in the component
    const res = await fetch('/api/courses/teacher', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('   Fetch response status:', res.status);
    
    const data = await res.json();
    console.log('   Fetch response data length:', data.length);
    
    if (res.ok) {
      console.log('   Setting courses data');
      // Simulate setCourses(data)
      console.log('   ✅ Courses loaded successfully');
    } else {
      console.log('   ❌ Error loading courses:', data.message);
    }
    
    console.log('   Setting coursesLoading to false');
    
    console.log('\n2. Simulating fetchAllStudents function...');
    console.log('   Setting studentsLoading to true');
    
    // Simulate the fetch request exactly as in the component
    const coursesRes = await fetch('/api/courses/teacher', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('   Courses fetch response status:', coursesRes.status);
    
    const coursesData = await coursesRes.json();
    console.log('   Courses fetch response data length:', coursesData.length);
    
    if (coursesRes.ok) {
      console.log('   Processing courses for student enrollment...');
      const allStudents = [];
      
      for (const course of coursesData) {
        const studentsRes = await fetch(`/api/enroll/students/${course._id}/details`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log(`   Students fetch for ${course.title} status:`, studentsRes.status);
        
        const studentsData = await studentsRes.json();
        
        if (studentsRes.ok) {
          const studentsWithCourseInfo = studentsData.map(student => ({
            ...student,
            courseTitle: course.title,
            courseId: course._id
          }));
          allStudents.push(...studentsWithCourseInfo);
        }
      }
      
      console.log('   Setting students data');
      // Simulate setStudents(allStudents)
      console.log('   ✅ Students loaded successfully');
      console.log('   Total students:', allStudents.length);
    }
    
    console.log('   Setting studentsLoading to false');
    
    console.log('\n✅ All frontend fetch operations completed successfully');
    
  } catch (error) {
    console.error('❌ Error in frontend fetch test:', error);
  }
}

// Since we're in Node.js, we need to simulate the proxy behavior
// Let's modify the fetch calls to use the actual backend URL
async function testFrontendFetchWithBackend() {
  try {
    console.log('1. Simulating fetchTeacherCourses function with backend URL...');
    console.log('   Setting coursesLoading to true');
    
    // Simulate the fetch request exactly as in the component but with full URL
    const res = await fetch('http://localhost:3003/api/courses/teacher', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('   Fetch response status:', res.status);
    
    const data = await res.json();
    console.log('   Fetch response data length:', data.length);
    
    if (res.ok) {
      console.log('   Setting courses data');
      // Simulate setCourses(data)
      console.log('   ✅ Courses loaded successfully');
    } else {
      console.log('   ❌ Error loading courses:', data.message);
    }
    
    console.log('   Setting coursesLoading to false');
    
    console.log('\n2. Simulating fetchAllStudents function with backend URL...');
    console.log('   Setting studentsLoading to true');
    
    // Simulate the fetch request exactly as in the component but with full URL
    const coursesRes = await fetch('http://localhost:3003/api/courses/teacher', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('   Courses fetch response status:', coursesRes.status);
    
    const coursesData = await coursesRes.json();
    console.log('   Courses fetch response data length:', coursesData.length);
    
    if (coursesRes.ok) {
      console.log('   Processing courses for student enrollment...');
      const allStudents = [];
      
      for (const course of coursesData) {
        const studentsRes = await fetch(`http://localhost:3003/api/enroll/students/${course._id}/details`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log(`   Students fetch for ${course.title} status:`, studentsRes.status);
        
        const studentsData = await studentsRes.json();
        
        if (studentsRes.ok) {
          const studentsWithCourseInfo = studentsData.map(student => ({
            ...student,
            courseTitle: course.title,
            courseId: course._id
          }));
          allStudents.push(...studentsWithCourseInfo);
        }
      }
      
      console.log('   Setting students data');
      // Simulate setStudents(allStudents)
      console.log('   ✅ Students loaded successfully');
      console.log('   Total students:', allStudents.length);
    }
    
    console.log('   Setting studentsLoading to false');
    
    console.log('\n✅ All frontend fetch operations with backend URL completed successfully');
    
  } catch (error) {
    console.error('❌ Error in frontend fetch test with backend URL:', error);
  }
}

testFrontendFetchWithBackend();