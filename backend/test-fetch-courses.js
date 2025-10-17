// test-fetch-courses.js
// Test fetching courses after creation

async function testFetchCourses() {
  try {
    console.log('Testing course fetching...');
    
    // Fetch all courses
    const response = await fetch('http://localhost:5000/api/courses');
    
    const data = await response.json();
    console.log('Courses response:', data);
    
    if (response.ok) {
      console.log('✅ Courses fetched successfully!');
      console.log('Number of courses:', data.length);
      if (data.length > 0) {
        console.log('First course:', data[0]);
      }
    } else {
      console.log('❌ Failed to fetch courses:', data.message);
    }
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  }
}

testFetchCourses();