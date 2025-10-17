// Debug the internal structure of mock courses
const mockCourse = require('./backend/models/MockCourse');

// Access the internal courses array directly
const coursesModule = require('./backend/models/MockCourse');
console.log('MockCourse module:', coursesModule);

// Try to access internal courses array
// We need to look at the actual implementation
console.log('Checking internal courses structure...');

// Let's try a different approach - check what happens when we create a course
async function debug() {
  // This won't work directly since we can't access the internal courses array
  // Let's check the server logs to see how courses are created
  console.log('Check server logs to see internal course structure');
}

debug().catch(console.error);