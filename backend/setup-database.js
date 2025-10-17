const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log('🔧 MySQL Database Setup\n');
  console.log('='.repeat(50));
  
  try {
    // Connect to MySQL server (without specifying database)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'lms_db'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${process.env.DB_NAME || 'lms_db'}' created/verified`);

    // Close connection
    await connection.end();

    console.log('\n' + '='.repeat(50));
    console.log('✅ Database setup complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the backend server: npm start');
    console.log('   2. Tables will be created automatically');
    console.log('   3. Sample data will be populated');
    console.log('\n🌐 Access: http://localhost:5000\n');

  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure MySQL is running');
    console.log('   2. Check DB_USER and DB_PASSWORD in .env file');
    console.log('   3. Verify MySQL credentials are correct\n');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('⚠️  MySQL server is not running!');
      console.log('   Start MySQL service and try again.\n');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('⚠️  Access denied! Check your MySQL credentials.');
      console.log('   Update DB_USER and DB_PASSWORD in .env file\n');
    }
    
    process.exit(1);
  }
}

setupDatabase();
