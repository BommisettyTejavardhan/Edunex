// Debug the internal courses structure
const MockCourse = require('./backend/models/MockCourse');

// Let's create a simple test to see the internal structure
async function debugInternalCourses() {
  console.log('Testing internal courses structure...');
  
  // Try to access all courses directly
  try {
    const allCourses = MockCourse.getAllCourses();
    console.log('All courses:', allCourses);
    
    if (allCourses && allCourses.length > 0) {
      console.log('Number of courses:', allCourses.length);
      allCourses.forEach((course, index) => {
        console.log(`Course ${index + 1}:`);
        console.log('  ID:', course._id);
        console.log('  Title:', course.title);
        console.log('  Teacher:', course.teacher);
        console.log('  Type of teacher:', typeof course.teacher);
        console.log('  Teacher value:', course.teacher);
        console.log('---');
      });
    } else {
      console.log('No courses found');
    }
  } catch (error) {
    console.log('Error accessing courses:', error);
  }
}

debugInternalCourses().catch(console.error);