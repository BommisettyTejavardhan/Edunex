const { Sequelize } = require('sequelize');

const connectMySQL = async () => {
  try {
    const sequelize = new Sequelize(
      process.env.DB_NAME || 'lms_db',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false, // Set to console.log to see SQL queries
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

    // Test the connection
    await sequelize.authenticate();
    console.log('✅ MySQL database connection established successfully');

    // Sync all models (create tables if they don't exist)
    await sequelize.sync({ alter: false }); // Set to true for development to auto-update tables
    console.log('✅ Database tables synchronized');

    return { success: true, sequelize };
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database:', error.message);
    console.log('💡 Make sure MySQL is running and credentials are correct in .env file');
    return { success: false, error: error.message };
  }
};

module.exports = connectMySQL;
