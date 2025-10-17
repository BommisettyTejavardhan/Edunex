// Comprehensive diagnostic tool for teacher dashboard loading issue
const runComprehensiveDiagnosis = async () => {
    console.log('=== Comprehensive Teacher Dashboard Diagnosis ===\n');
    
    // 1. Check if we're on the right page
    console.log('1. Current page:', window.location.href);
    
    // 2. Check localStorage token
    console.log('\n2. Token Check:');
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('   ❌ ERROR: No token found in localStorage');
        return;
    }
    console.log('   ✅ Token found in localStorage');
    
    // 3. Decode token
    console.log('\n3. Token Decoding:');
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('   ✅ Token decoded successfully');
        console.log('   User name:', payload.name || 'N/A');
        console.log('   User role:', payload.role || 'N/A');
        console.log('   Token expiration:', new Date(payload.exp * 1000).toLocaleString());
        
        // Check if token is expired
        if (payload.exp * 1000 < Date.now()) {
            console.log('   ❌ ERROR: Token has expired');
            return;
        } else {
            console.log('   ✅ Token is still valid');
        }
    } catch (error) {
        console.log('   ❌ ERROR: Failed to decode token:', error.message);
        return;
    }
    
    // 4. Test API endpoints
    console.log('\n4. API Endpoint Testing:');
    
    // Test courses API
    try {
        console.log('   Testing /api/courses/teacher...');
        const coursesResponse = await fetch('/api/courses/teacher', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('   Courses API Status:', coursesResponse.status);
        if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json();
            console.log('   ✅ Courses API working, found', coursesData.length, 'courses');
        } else {
            console.log('   ❌ Courses API Error:', coursesResponse.status, coursesResponse.statusText);
            const errorText = await coursesResponse.text();
            console.log('   Error details:', errorText);
        }
    } catch (error) {
        console.log('   ❌ Courses API Network Error:', error.message);
    }
    
    // Test students API
    try {
        console.log('   Testing /api/students...');
        const studentsResponse = await fetch('/api/students', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('   Students API Status:', studentsResponse.status);
        if (studentsResponse.ok) {
            const studentsData = await studentsResponse.json();
            console.log('   ✅ Students API working, found', studentsData.length, 'students');
        } else {
            console.log('   ❌ Students API Error:', studentsResponse.status, studentsResponse.statusText);
            const errorText = await studentsResponse.text();
            console.log('   Error details:', errorText);
        }
    } catch (error) {
        console.log('   ❌ Students API Network Error:', error.message);
    }
    
    // 5. Check React component state (if we can access it)
    console.log('\n5. Component State Check:');
    console.log('   To check component state, please open React DevTools in your browser.');
    
    console.log('\n=== Diagnosis Complete ===');
};

// Run the diagnosis
runComprehensiveDiagnosis();