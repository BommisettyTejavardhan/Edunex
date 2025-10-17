const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugCourse() {
  console.log('Debugging course details...');
  
  // Fetch courses
  let response = await fetch('http://localhost:5000/api/courses', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  let data = await response.json();
  console.log('All courses:');
  data.forEach(course => {
    console.log(`Course ID: ${course._id}`);
    console.log(`Course Title: ${course.title}`);
    console.log(`Course Teacher:`, course.teacher);
    console.log(`Teacher Type:`, typeof course.teacher);
    console.log('---');
  });
}

debugCourse().catch(console.error);