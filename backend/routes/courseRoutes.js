const express = require('express');
const { createCourse, getCourses, getCoursesByTeacher, getCourseById, updateCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createCourse)
  .get(getCourses);

router.route('/teacher')
  .get(protect, getCoursesByTeacher);

router.route('/:id')
  .get(getCourseById)
  .put(protect, updateCourse);

module.exports = router;