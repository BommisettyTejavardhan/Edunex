const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testDeadlines() {
  try {
    console.log('Testing course deadlines functionality...');
    
    // Fetch courses
    console.log('\n1. Fetching courses...');
    const response = await fetch('http://localhost:5000/api/courses');
    const courses = await response.json();
    
    console.log('Courses received:', JSON.stringify(courses, null, 2));
    
    if (courses && courses.length > 0) {
      console.log('\n✅ SUCCESS: Courses fetched successfully!');
      console.log('Number of courses:', courses.length);
      
      // Check if enrollmentDeadline is present in courses
      courses.forEach((course, index) => {
        console.log(`\nCourse ${index + 1}: ${course.title}`);
        console.log(`  Description: ${course.description}`);
        console.log(`  Duration: ${course.duration} hours`);
        console.log(`  Enrollment Deadline: ${course.enrollmentDeadline || 'Not set'}`);
      });
      
      // Test fetching a specific course by ID
      const firstCourseId = courses[0]._id;
      console.log(`\n2. Fetching course by ID: ${firstCourseId}`);
      const courseResponse = await fetch(`http://localhost:5000/api/courses/${firstCourseId}`);
      const course = await courseResponse.json();
      
      console.log('Course details:', JSON.stringify(course, null, 2));
      console.log(`\nCourse enrollment deadline: ${course.enrollmentDeadline || 'Not set'}`);
    } else {
      console.log('\n❌ FAILED: No courses received');
    }
  } catch (error) {
    console.error('Error testing deadlines:', error);
  }
}

testDeadlines().catch(console.error);