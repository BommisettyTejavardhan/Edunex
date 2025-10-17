// test-registration.js
// Using global fetch API (Node.js 18+)

async function testRegistration() {
  try {
    console.log('Testing user registration...');
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User 4',
        email: 'test4@example.com', // Use a completely new email
        password: 'password123',
        role: 'Student'
      }),
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('User ID:', data._id);
      console.log('Token:', data.token ? 'Generated' : 'Missing');
    } else {
      console.log('❌ Registration failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error during registration test:', error.message);
  }
}

testRegistration();