#!/usr/bin/env node

/**
 * Railway Deployment Helper Script
 * This script provides guidance for deploying the LMS to Railway
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 LMS Railway Deployment Helper');
console.log('==================================\n');

// Check if we're in the right directory
if (!fs.existsSync(path.join(__dirname, 'backend')) || !fs.existsSync(path.join(__dirname, 'frontend'))) {
  console.error('❌ Error: Please run this script from the root of the LMS project directory');
  console.error('   The directory should contain both "backend" and "frontend" folders');
  process.exit(1);
}

console.log('✅ Project structure verified\n');

// Check for required files
const requiredFiles = [
  'railway.json',
  'backend/railway.json',
  'frontend/railway.json',
  '.railwayignore',
  'backend/.railwayignore',
  'frontend/.railwayignore'
];

console.log('📋 Checking for Railway configuration files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} (missing)`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n⚠️  Some Railway configuration files are missing.');
  console.log('   Please ensure you have the latest version of the project.');
}

console.log('\n📖 Deployment Instructions:');
console.log('--------------------------');
console.log('1. Install Railway CLI:');
console.log('   npm install -g @railway/cli\n');

console.log('2. Login to Railway:');
console.log('   railway login\n');

console.log('3. Create a new Railway project:');
console.log('   railway init\n');

console.log('4. Deploy the backend:');
console.log('   cd backend');
console.log('   railway up\n');

console.log('5. Deploy the frontend:');
console.log('   cd ../frontend');
console.log('   railway up\n');

console.log('6. Set Environment Variables in Railway:');
console.log('   - NODE_ENV=production');
console.log('   - PORT=5000');
console.log('   - DB_TYPE=mysql');
console.log('   - DB_HOST=your-mysql-host');
console.log('   - DB_PORT=3306');
console.log('   - DB_NAME=railway');
console.log('   - DB_USER=root');
console.log('   - DB_PASSWORD=your-mysql-password');
console.log('   - JWT_SECRET=generate-a-strong-secret');
console.log('   - CORS_ORIGIN=https://your-frontend.railway.app');
console.log('   - FRONTEND_URL=https://your-frontend.railway.app\n');

console.log('📄 For detailed instructions, see RAILWAY_DEPLOYMENT.md');
console.log('   in your project directory.\n');

console.log('💡 Pro Tips:');
console.log('------------');
console.log('- Use Railway\'s MySQL add-on for database provisioning');
console.log('- Set up service linking between frontend and backend');
console.log('- Configure custom domains in Railway dashboard');
console.log('- Monitor logs using "railway logs" command\n');

console.log('🎉 Happy deploying!');