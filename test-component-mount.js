// Test component mount simulation
const jwt = require('jsonwebtoken');

// Generate a valid token for the teacher
const token = jwt.sign(
  { id: 1, name: 'Dr. Smith', role: 'Teacher' },
  'lmssecretkey',
  { expiresIn: '30d' }
);

console.log('Testing component mount simulation...\n');

async function simulateComponentMount() {
  try {
    console.log('1. Simulating localStorage.getItem("token")...');
    const localStorageToken = token; // Simulate token in localStorage
    console.log('✅ Token retrieved from localStorage');
    
    if (!localStorageToken) {
      console.log('❌ No token found, would navigate to /login');
      return;
    }
    
    console.log('\n2. Simulating token decoding...');
    let userRole, userName, user;
    
    try {
      const payload = JSON.parse(atob(localStorageToken.split('.')[1]));
      userRole = payload.role || 'Teacher';
      userName = payload.name || 'User';
      
      user = {
        name: userName,
        role: userRole
      };
      
      console.log('✅ Token decoded successfully');
      console.log('   User:', JSON.stringify(user, null, 2));
    } catch (error) {
      console.log('❌ Error decoding token:', error.message);
      console.log('   Would navigate to /login');
      return;
    }
    
    console.log('\n3. Simulating teacher course fetching...');
    if (userRole === 'Teacher') {
      console.log('   User is a teacher, fetching courses and students...');
      
      // Simulate fetchTeacherCourses
      console.log('   Calling fetchTeacherCourses...');
      try {
        console.log('   Setting coursesLoading to true');
        const res = await fetch('http://localhost:3003/api/courses/teacher', {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`
          }
        });
        
        console.log('   Courses fetch response status:', res.status);
        
        const data = await res.json();
        
        if (res.ok) {
          console.log('   Setting courses data');
          console.log('   ✅ Courses loaded successfully');
          console.log('   Courses count:', data.length);
        } else {
          console.log('   ❌ Error loading courses:', data.message);
        }
        
        console.log('   Setting coursesLoading to false');
      } catch (error) {
        console.log('   ❌ Error in fetchTeacherCourses:', error.message);
        console.log('   Setting coursesLoading to false');
      }
      
      // Simulate fetchAllStudents
      console.log('\n   Calling fetchAllStudents...');
      try {
        console.log('   Setting studentsLoading to true');
        
        const coursesRes = await fetch('http://localhost:3003/api/courses/teacher', {
          headers: {
            'Authorization': `Bearer ${localStorageToken}`
          }
        });
        
        console.log('   Courses fetch response status:', coursesRes.status);
        
        const coursesData = await coursesRes.json();
        
        if (coursesRes.ok) {
          console.log('   Processing courses for student enrollment...');
          const allStudents = [];
          
          for (const course of coursesData) {
            const studentsRes = await fetch(`http://localhost:3003/api/enroll/students/${course._id}/details`, {
              headers: {
                'Authorization': `Bearer ${localStorageToken}`
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
          console.log('   ✅ Students loaded successfully');
          console.log('   Students count:', allStudents.length);
        }
        
        console.log('   Setting studentsLoading to false');
      } catch (error) {
        console.log('   ❌ Error in fetchAllStudents:', error.message);
        console.log('   Setting studentsLoading to false');
      }
    }
    
    console.log('\n4. Setting main loading state to false...');
    console.log('✅ Main loading state set to false');
    
    console.log('\n🎉 Component mount simulation completed successfully!');
    console.log('   The component should now display the dashboard content');
    
  } catch (error) {
    console.error('❌ Error in component mount simulation:', error);
  }
}

simulateComponentMount();