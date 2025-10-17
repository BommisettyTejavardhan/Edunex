// Try to access internal course structure
const MockCourse = require('./backend/models/MockCourse');

// Let's create a simple test to see the internal structure
async function debugInternalCourse() {
  console.log('Testing internal course structure...');
  
  // Try to access a course by ID directly
  try {
    const course = await MockCourse.findById(1760685188949);
    console.log('Course object:', course);
    if (course) {
      console.log('Course teacher property:', course.teacher);
      console.log('Type of course.teacher:', typeof course.teacher);
    } else {
      console.log('Course not found');
    }
  } catch (error) {
    console.log('Error accessing course:', error);
  }
}

debugInternalCourse().catch(console.error);