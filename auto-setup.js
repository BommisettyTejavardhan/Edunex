const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function findPassword() {
  const passwords = ['', 'root', 'admin', 'password', 'mysql', '123456', 'Password123'];
  
  console.log('🔍 Testing MySQL connection with common passwords...\n');
  
  for (const pwd of passwords) {
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: pwd
      });
      
      await connection.end();
      
      console.log(`✅ SUCCESS! Working password found: "${pwd || '(empty)'}"\n`);
      
      // Update .env file
      const envPath = path.join(__dirname, 'backend', '.env');
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${pwd}`);
      fs.writeFileSync(envPath, envContent);
      
      console.log('✅ Updated backend/.env file\n');
      console.log('🔧 Setting up database...\n');
      
      // Setup database
      const setupDb = require('./backend/setup-database.js');
      
      return true;
    } catch (error) {
      console.log(`❌ Failed with password: "${pwd || '(empty)'}"`);
    }
  }
  
  console.log('\n⚠️  Could not find working password.');
  console.log('Please provide your MySQL password manually.\n');
  return false;
}

findPassword();
