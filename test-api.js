// Test script to verify API endpoints are working

async function testAPI() {
  try {
    console.log('Testing /api/courses/teacher endpoint...');
    
    const response = await fetch('http://localhost:3003/api/courses/teacher', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRyLiBTbWl0aCIsInJvbGUiOiJUZWFjaGVyIiwiaWF0IjoxNzYwNjI0MjA3LCJleHAiOjE3NjMyMTYyMDd9.sFTkWl0aCIsInJvbGUiOiJUZWFjaGVyIiwiaWF0IjoxNzYwNjI0MjA3LCJleHAiOjE3NjMyMTYyMDd9',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Received data:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('Error response:', await response.text());
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI();