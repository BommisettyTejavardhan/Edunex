const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function createStudent() {
  console.log('Creating student user...');
  
  // Register a student user
  let response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Student',
      email: 'student@test.com',
      password: 'password123',
      role: 'Student'
    })
  });
  
  let data = await response.json();
  console.log('Student registration response:', data);
  
  if (response.ok) {
    console.log('✅ Student user created successfully!');
  } else {
    console.log('❌ Failed to create student user');
  }
}

createStudent().catch(console.error);