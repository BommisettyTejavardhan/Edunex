// Try to use real MongoDB Course model, fallback to mock if MongoDB is not available
let Course;
let useMockDB = false;

try {
  Course = require('../models/Course');
  // Test if we can connect to MongoDB
  const mongoose = require('mongoose');
  if (!mongoose.connection.readyState) {
    throw new Error('MongoDB not connected');
  }
} catch (error) {
  console.log('MongoDB not available, using mock Course model');
  Course = require('../models/MockCourse');
  useMockDB = true;
}

// Try to use real MongoDB User model, fallback to mock if MongoDB is not available
let User;
let useMockUserDB = false;

try {
  User = require('../models/User');
  // Test if we can connect to MongoDB
  const mongoose = require('mongoose');
  if (!mongoose.connection.readyState) {
    throw new Error('MongoDB not connected');
  }
} catch (error) {
  console.log('MongoDB not available, using mock User model');
  User = require('../models/MockUser');
  useMockUserDB = true;
}

const asyncHandler = require('../middleware/asyncHandler');

// @desc    Enroll in a course
// @route   POST /api/enroll/:id
// @access  Private/Student
const enrollInCourse = asyncHandler(async (req, res) => {
  // For mock database, we need to handle the course ID differently
  const courseId = useMockDB ? req.params.id : req.params.id;
  const course = await Course.findById(courseId);

  if (course) {
    // Check if student is already enrolled
    const studentIds = useMockDB ? Course.getStudentIds(course.students) : course.students;
    if (studentIds.includes(req.user.id)) {
      res.status(400);
      throw new Error('Already enrolled in this course');
    }

    // Add student to course
    if (useMockDB) {
      // Use the new method to add student with enrollment date
      await Course.addStudent(courseId, req.user.id);
    } else {
      course.students.push(req.user.id);
      await course.save();
    }

    res.json({ message: 'Enrolled successfully' });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Get enrolled courses
// @route   GET /api/enroll/mycourses
// @access  Private/Student
const getMyCourses = asyncHandler(async (req, res) => {
  // For mock database, we need to handle the query differently
  if (useMockDB) {
    const allCourses = await Course.find();
    const enrolledCourses = allCourses.filter(course => {
      const studentIds = Course.getStudentIds(course.students);
      return studentIds.includes(req.user.id);
    });
    // Mock populate for teacher names using the teachers registered in MockCourse
    const mockTeachers = Course.getTeachers();
    const populatedCourses = enrolledCourses.map(course => {
      return {
        ...course,
        teacher: { name: mockTeachers[course.teacher] || `Teacher ${course.teacher}` }
      };
    });
    res.json(populatedCourses);
  } else {
    const courses = await Course.find({ students: req.user.id }).populate('teacher', 'name');
    res.json(courses);
  }
});

// @desc    Get students in a course with enrollment details
// @route   GET /api/enroll/students/:id/details
// @access  Private/Teacher
const getStudentsInCourseWithDetails = asyncHandler(async (req, res) => {
  // For mock database, we need to handle the course ID differently
  const courseId = useMockDB ? req.params.id : req.params.id;
  const course = await Course.findById(courseId);

  if (course && course.teacher.toString() === req.user.id.toString()) {
    if (useMockDB) {
      // For mock DB, get student details from MockUser
      const studentDetails = [];
      
      // Iterate through enrolled students
      for (const student of course.students) {
        // Extract student ID and enrollment date
        const studentId = student.id || student;
        const enrolledAt = student.enrolledAt || new Date();
        
        // Get student info using findById
        let studentInfo = null;
        try {
          studentInfo = await User.findById(studentId);
        } catch (error) {
          console.error('Error finding student:', error);
        }
        
        if (studentInfo) {
          studentDetails.push({
            id: studentInfo._id,
            name: studentInfo.name,
            email: studentInfo.email,
            enrolledAt: enrolledAt
          });
        }
      }
      res.json(studentDetails);
    } else {
      // For real DB, populate student details
      const students = await User.find({ _id: { $in: course.students } });
      res.json(students);
    }
  } else {
    res.status(404);
    throw new Error('Course not found or not authorized');
  }
});

module.exports = {
  enrollInCourse,
  getMyCourses,
  getStudentsInCourseWithDetails
};