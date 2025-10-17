const connectMySQL = require('../config/mysql-db');

let db = {};

const initializeModels = async () => {
  const connection = await connectMySQL();
  
  if (!connection.success) {
    console.error('❌ MySQL connection failed!');
    console.error('❌ Application requires MySQL database to run.');
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure MySQL is running on your laptop');
    console.error('   2. Check DB_PASSWORD in backend\\.env file');
    console.error('   3. Run: node setup-database.js to create database');
    console.error('\n⚠️  Server will not start without MySQL connection!\n');
    process.exit(1); // Exit the application
  }

  const sequelize = connection.sequelize;

  // Import models
  const User = require('./mysql/User')(sequelize);
  const Course = require('./mysql/Course')(sequelize);
  const Enrollment = require('./mysql/Enrollment')(sequelize);
  const Assignment = require('./mysql/Assignment')(sequelize);
  const Submission = require('./mysql/Submission')(sequelize);

  // Define associations
  // User - Course (Teacher relationship)
  User.hasMany(Course, {
    foreignKey: 'teacherId',
    as: 'taughtCourses'
  });
  Course.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher'
  });

  // User - Enrollment - Course (Student enrollment)
  User.belongsToMany(Course, {
    through: Enrollment,
    foreignKey: 'studentId',
    as: 'enrolledCourses'
  });
  Course.belongsToMany(User, {
    through: Enrollment,
    foreignKey: 'courseId',
    as: 'students'
  });

  // Course - Assignment
  Course.hasMany(Assignment, {
    foreignKey: 'courseId',
    as: 'assignments'
  });
  Assignment.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course'
  });

  // User - Submission
  User.hasMany(Submission, {
    foreignKey: 'studentId',
    as: 'submissions'
  });
  Submission.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student'
  });

  // Assignment - Submission
  Assignment.hasMany(Submission, {
    foreignKey: 'assignmentId',
    as: 'submissions'
  });
  Submission.belongsTo(Assignment, {
    foreignKey: 'assignmentId',
    as: 'assignment'
  });

  // Sync database (create tables if they don't exist)
  await sequelize.sync({ alter: false }); // Change to true for development

  db = {
    sequelize,
    User,
    Course,
    Enrollment,
    Assignment,
    Submission
  };

  console.log('✅ MySQL models initialized and associations created');
  
  return db;
};

module.exports = { initializeModels, getDB: () => db };
