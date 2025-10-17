const asyncHandler = require('../middleware/asyncHandler');

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

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Teacher
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;

  // For mock database, we need to handle the teacher ID differently
  const teacherId = typeof req.user.id === 'number' ? req.user.id : req.user._id;

  const courseData = {
    title,
    description,
    duration,
    teacher: teacherId
  };

  // Create course using either real or mock model
  const course = useMockDB 
    ? await Course.create(courseData)
    : await Course.create(courseData);

  res.status(201).json(course);
});

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  // For mock database, return all courses with populated teacher names
  // In a real implementation, this would query the database
  if (useMockDB) {
    const courses = await Course.find();
    // Mock populate for teacher names using the teachers registered in MockCourse
    const mockTeachers = Course.getTeachers();
    const populatedCourses = courses.map(course => {
      return {
        ...course,
        teacher: { name: mockTeachers[course.teacher] || `Teacher ${course.teacher}` }
      };
    });
    res.json(populatedCourses);
  } else {
    const courses = await Course.find().populate('teacher', 'name');
    res.json(courses);
  }
});

// @desc    Get courses by teacher
// @route   GET /api/courses/teacher
// @access  Private/Teacher
const getCoursesByTeacher = asyncHandler(async (req, res) => {
  // For mock database, find courses by teacher ID
  // In a real implementation, this would query the database
  if (useMockDB) {
    const courses = await Course.findByTeacher(req.user.id);
    // Mock populate for teacher names using the teachers registered in MockCourse
    const mockTeachers = Course.getTeachers();
    const populatedCourses = courses.map(course => {
      return {
        ...course,
        teacher: { name: mockTeachers[course.teacher] || `Teacher ${course.teacher}` }
      };
    });
    res.json(populatedCourses);
  } else {
    const courses = await Course.find({ teacher: req.user.id }).populate('teacher', 'name');
    res.json(courses);
  }
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  // For mock database, find course by ID
  // In a real implementation, this would query the database
  let course;
  if (useMockDB) {
    course = await Course.findById(req.params.id);
    // Mock populate for teacher names using the teachers registered in MockCourse
    if (course) {
      const mockTeachers = Course.getTeachers();
      course.teacher = { name: mockTeachers[course.teacher] || `Teacher ${course.teacher}` };
    }
  } else {
    course = await Course.findById(req.params.id).populate('teacher', 'name');
  }

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Teacher
const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  
  // For mock database, we need to handle the course ID differently
  const courseId = useMockDB ? req.params.id : req.params.id;
  
  // Find and update course
  let course;
  if (useMockDB) {
    course = await Course.findByIdAndUpdate(courseId, {
      title,
      description,
      duration
    });
  } else {
    course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        duration
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('teacher', 'name');
  }

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

module.exports = {
  createCourse,
  getCourses,
  getCoursesByTeacher,
  getCourseById,
  updateCourse
};