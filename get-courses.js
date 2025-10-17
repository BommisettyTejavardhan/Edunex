const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getCourses() {
  console.log('Fetching courses...');
  
  // Fetch courses
  let response = await fetch('http://localhost:5000/api/courses', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  let data = await response.json();
  console.log('Courses response:', data);
  
  if (response.ok && data.length > 0) {
    console.log('✅ Courses fetched successfully!');
    console.log('First course ID:', data[0]._id);
    return data[0]._id;
  } else {
    console.log('❌ Failed to fetch courses');
    return null;
  }
}

getCourses().catch(console.error);