// test-login.js
// Using global fetch API (Node.js 18+)

async function testLogin() {
  try {
    console.log('Testing user login...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test4@example.com', // Use the correct email
        password: 'password123'
      }),
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User ID:', data._id);
      console.log('Token:', data.token ? 'Generated' : 'Missing');
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error during login test:', error.message);
  }
}

testLogin();