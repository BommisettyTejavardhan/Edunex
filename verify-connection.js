const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function verifyConnection() {
  console.log('🔍 Verifying LMS Application Setup...\n');
  
  try {
    // Test backend API
    console.log('1. Testing Backend Server (http://localhost:5000)...');
    const backendResponse = await fetch('http://localhost:5000/');
    const backendData = await backendResponse.json();
    console.log('   ✅ Backend server is running');
    console.log(`   ✅ Status: ${backendData.message}`);
    console.log(`   ✅ Database: ${backendData.database}\n`);
    
    // Test courses API
    console.log('2. Testing Courses API...');
    const coursesResponse = await fetch('http://localhost:5000/api/courses');
    const coursesData = await coursesResponse.json();
    console.log(`   ✅ Found ${coursesData.length} courses available`);
    coursesData.slice(0, 3).forEach((course, index) => {
      console.log(`      ${index + 1}. ${course.title} (${course.duration} hours)`);
    });
    console.log('');
    
    // Test frontend (if available)
    console.log('3. Testing Frontend Server (http://localhost:3000)...');
    try {
      const frontendResponse = await fetch('http://localhost:3000/');
      if (frontendResponse.ok) {
        console.log('   ✅ Frontend server is running and accessible\n');
      }
    } catch (error) {
      console.log('   ⚠️  Frontend server might still be starting...\n');
    }
    
    console.log('🎉 Application Setup Complete!\n');
    console.log('📋 Access Information:');
    console.log('   • Frontend: http://localhost:3000');
    console.log('   • Backend API: http://localhost:5000');
    console.log('   • API Documentation: http://localhost:5000/api\n');
    
    console.log('👤 Test Credentials:');
    console.log('   Teacher Account:');
    console.log('   • Email: teacher@example.com');
    console.log('   • Password: password123\n');
    
    console.log('   Student Account (create via registration):');
    console.log('   • Use the registration page to create a student account\n');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\nPlease ensure both servers are running:');
    console.log('   • Backend: cd backend && npm start');
    console.log('   • Frontend: cd frontend && npm start');
  }
}

verifyConnection();
