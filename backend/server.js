const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initializeModels } = require('./models/index');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Configure CORS for Railway deployment
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Initialize database and start server
initializeModels().then(async (db) => {
  const app = express();

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json());
  
  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Routes
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/courses', require('./routes/courseRoutes'));
  app.use('/api/enroll', require('./routes/enrollmentRoutes'));
  app.use('/api/assignments', require('./routes/assignmentRoutes'));
  app.use('/api/submissions', require('./routes/submissionRoutes'));

  // Debug endpoint to see internal courses
  app.get('/api/debug/courses', (req, res) => {
    try {
      const MockCourse = require('./models/MockCourse');
      const courses = MockCourse.getAllCourses();
      const teachers = MockCourse.getTeachers();
      res.json({ courses, teachers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/', (req, res) => {
    res.json({ 
      message: 'LMS API Running',
      database: db.sequelize ? 'MySQL Connected' : 'Mock Database',
      dbType: process.env.DB_TYPE || 'mysql',
      dbName: process.env.DB_NAME || 'lms_db',
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 5000
    });
  });

  // Error Handler
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, async () => {
    console.log(`✅ Server running on port ${PORT}`);
    
    // Check if using mock or MySQL database
    if (db.sequelize) {
      console.log(`✅ MySQL database connected successfully`);
      await initializeSampleData(db);
    } else {
      console.log(`✅ Mock database initialized (in-memory storage)`);
      await initializeMockData();
    }
  });
});

// Function to initialize sample data for MySQL database
async function initializeSampleData(db) {
  try {
    const { User, Course, sequelize } = db;
    
    // Only run for MySQL (sequelize exists)
    if (!sequelize) {
      return;
    }
    
    // Check if we already have users
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('✅ MySQL database already has data');
      return;
    }
    
    console.log('🔄 Initializing MySQL database with sample data...');
    
    // Create sample teacher
    const teacher = await User.create({
      name: 'Dr. Smith',
      email: 'teacher@example.com',
      password: 'password123',
      role: 'Teacher'
    });
    
    console.log('✅ Created sample teacher:', teacher.name);
    
    // Create sample student
    const student = await User.create({
      name: 'John Student',
      email: 'student@example.com',
      password: 'password123',
      role: 'Student'
    });
    
    console.log('✅ Created sample student:', student.name);
    
    // Create sample courses
    const courses = [
      {
        title: 'Introduction to React',
        description: 'Learn the fundamentals of React.js, including components, state, and props.',
        duration: 12,
        enrollmentDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        teacherId: teacher.id
      },
      {
        title: 'Advanced JavaScript',
        description: 'Deep dive into advanced JavaScript concepts including closures, prototypes, and async programming.',
        duration: 15,
        enrollmentDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        teacherId: teacher.id
      },
      {
        title: 'UI/UX Design Principles',
        description: 'Explore the core principles of user interface and user experience design.',
        duration: 10,
        enrollmentDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        teacherId: teacher.id
      }
    ];
    
    for (const courseData of courses) {
      const course = await Course.create(courseData);
      console.log('✅ Created sample course:', course.title);
    }
    
    console.log('✅ MySQL database initialized with sample data');
  } catch (error) {
    console.log('⚠️  Failed to initialize MySQL database:', error.message);
  }
}

// Function to initialize sample data for mock database
async function initializeMockData() {
  try {
    // Try to use mock models
    let User, Course;
    try {
      User = require('./models/MockUser');
      Course = require('./models/MockCourse');
    } catch (error) {
      console.log('⚠️  Mock models not available for initialization');
      return;
    }
    
    // Check if we already have users by checking if getUsers returns any data
    const existingUsers = User.getUsers ? Object.values(User.getUsers()) : [];
    if (existingUsers.length > 0) {
      console.log('✅ Mock database already initialized with users');
      return;
    }
    
    // Create sample teacher
    const teacher = await User.create({
      name: 'Dr. Smith',
      email: 'teacher@example.com',
      password: 'password123',
      role: 'Teacher'
    });
    
    console.log('✅ Created sample teacher:', teacher.name);
    
    // Register teacher in Course model
    if (Course.registerTeacher) {
      Course.registerTeacher(teacher._id, teacher.name);
    }
    
    // Create sample courses with enrollment deadlines
    const courses = [
      {
        title: 'Introduction to React',
        description: 'Learn the fundamentals of React.js, including components, state, and props.',
        duration: 12,
        enrollmentDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        teacher: teacher._id
      },
      {
        title: 'Advanced JavaScript',
        description: 'Deep dive into advanced JavaScript concepts including closures, prototypes, and async programming.',
        duration: 15,
        enrollmentDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        teacher: teacher._id
      },
      {
        title: 'UI/UX Design Principles',
        description: 'Explore the core principles of user interface and user experience design.',
        duration: 10,
        enrollmentDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now (deadline approaching!)
        teacher: teacher._id
      }
    ];
    
    for (const courseData of courses) {
      const course = await Course.create(courseData);
      console.log('✅ Created sample course:', course.title);
    }
    
    console.log('✅ Mock database initialized with sample data');
  } catch (error) {
    console.log('⚠️  Failed to initialize mock database:', error.message);
  }
}