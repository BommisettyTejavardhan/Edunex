const express = require('express');
const { createAssignment, getAssignmentsByCourse } = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createAssignment);

router.route('/course/:id')
  .get(getAssignmentsByCourse);

module.exports = router;