const express = require('express');
const { enrollInCourse, getMyCourses, getStudentsInCourseWithDetails } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:id')
  .post(protect, enrollInCourse);

router.route('/mycourses')
  .get(protect, getMyCourses);

router.route('/students/:id/details')
  .get(protect, getStudentsInCourseWithDetails);

module.exports = router;