// Diagnostic script for teacher dashboard loading issue
const diagnoseDashboardIssue = async () => {
    console.log('=== Teacher Dashboard Diagnosis ===');
    
    // Check if token exists
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    
    if (!token) {
        console.log('ERROR: No token found. Please log in first.');
        return;
    }
    
    // Try to decode token
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('User role:', payload.role || 'Not specified');
        console.log('User name:', payload.name || 'Not specified');
    } catch (error) {
        console.log('ERROR: Failed to decode token:', error.message);
        return;
    }
    
    // Test API connection
    try {
        console.log('Testing API connection...');
        const response = await fetch('/api/courses/teacher', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('API response status:', response.status);
        
        if (response.ok) {
            const courses = await response.json();
            console.log('Courses fetched successfully:', courses.length, 'courses');
        } else {
            console.log('API Error:', response.status, response.statusText);
            const errorText = await response.text();
            console.log('Error details:', errorText);
        }
    } catch (error) {
        console.log('Network Error:', error.message);
    }
    
    // Test students API
    try {
        console.log('Testing students API connection...');
        const response = await fetch('/api/students', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Students API response status:', response.status);
        
        if (response.ok) {
            const students = await response.json();
            console.log('Students fetched successfully:', students.length, 'students');
        } else {
            console.log('Students API Error:', response.status, response.statusText);
            const errorText = await response.text();
            console.log('Error details:', errorText);
        }
    } catch (error) {
        console.log('Students Network Error:', error.message);
    }
};

// Run diagnosis
diagnoseDashboardIssue();