const mysql = require('mysql2/promise');

async function testConnection() {
  const passwords = ['', 'root', 'admin', 'password', 'mysql', '123456'];
  
  console.log('🔍 Testing MySQL connection with common passwords...\n');
  
  for (const pwd of passwords) {
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: pwd
      });
      
      console.log(`✅ SUCCESS! Password is: "${pwd || '(empty)'}"
      
Update your backend/.env file:
DB_PASSWORD=${pwd}

Then run: node setup-database.js
`);
      await connection.end();
      return;
    } catch (error) {
      console.log(`❌ Failed with password: "${pwd || '(empty)'}"`);
    }
  }
  
  console.log('\n⚠️  None of the common passwords worked.');
  console.log('\nPlease do one of the following:');
  console.log('1. Check your MySQL installation documentation for the password');
  console.log('2. Reset MySQL password using MySQL Workbench or command line');
  console.log('3. Tell me your MySQL password and I\'ll update the .env file');
}

testConnection();
