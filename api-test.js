const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPI() {
  try {
    console.log('Testing API connection...');
    
    // Test courses endpoint
    const response = await fetch('http://localhost:5000/api/courses');
    const data = await response.json();
    
    console.log('✅ API Connection successful!');
    console.log(`✅ Found ${data.length} courses`);
    
    // Test auth endpoint
    const authResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teacher@example.com',
        password: 'password123'
      })
    });
    
    const authData = await authResponse.json();
    
    if (authResponse.ok) {
      console.log('✅ Authentication endpoint working!');
      console.log(`✅ Teacher login successful: ${authData.name}`);
    } else {
      console.log('⚠️ Authentication failed:', authData.message);
    }
    
  } catch (error) {
    console.log('❌ API Test failed:', error.message);
  }
}

testAPI();