const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function fetchDebugInfo() {
  console.log('Fetching debug info...');
  
  try {
    const response = await fetch('http://localhost:5000/api/debug/courses');
    const data = await response.json();
    
    console.log('Debug Info:');
    console.log('Courses:', JSON.stringify(data.courses, null, 2));
    console.log('Teachers:', JSON.stringify(data.teachers, null, 2));
    
    // Let's also check a specific course
    if (data.courses && data.courses.length > 0) {
      console.log('\nFirst course details:');
      const firstCourse = data.courses[0];
      console.log('ID:', firstCourse._id);
      console.log('Title:', firstCourse.title);
      console.log('Teacher:', firstCourse.teacher);
      console.log('Type of teacher:', typeof firstCourse.teacher);
    }
  } catch (error) {
    console.error('Error fetching debug info:', error);
  }
}

fetchDebugInfo().catch(console.error);