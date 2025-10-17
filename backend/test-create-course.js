// test-create-course.js
// First, register a user and get a token, then create a course

async function testCreateCourse() {
  try {
    console.log('Testing course creation...');
    
    // First, register a teacher user
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Teacher User',
        email: 'teacher@example.com',
        password: 'password123',
        role: 'Teacher'
      }),
    });
    
    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);
    
    if (!registerResponse.ok) {
      console.log('❌ Registration failed:', registerData.message);
      return;
    }
    
    const token = registerData.token;
    console.log('✅ Registration successful, token received');
    
    // Now try to create a course
    const courseResponse = await fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Test Course',
        description: 'This is a test course',
        duration: 10
      }),
    });
    
    const courseData = await courseResponse.json();
    console.log('Course creation response:', courseData);
    
    if (courseResponse.ok) {
      console.log('✅ Course created successfully!');
      console.log('Course ID:', courseData._id);
    } else {
      console.log('❌ Course creation failed:', courseData.message);
    }
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  }
}

testCreateCourse();