const express = require('express');
const { 
  submitAssignment, 
  submitAssignmentWithFile, 
  downloadSubmissionFile, 
  gradeSubmission, 
  getSubmissionsByAssignment, 
  getMySubmissions,
  getCourseGrades,
  getAllStudentGrades,
  getCourseStatistics
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .post(protect, submitAssignment);

router.route('/upload')
  .post(protect, upload.single('file'), submitAssignmentWithFile);

router.route('/my')
  .get(protect, getMySubmissions);

router.route('/student/all-grades')
  .get(protect, getAllStudentGrades);

router.route('/course/:courseId/grades')
  .get(protect, getCourseGrades);

router.route('/course/:courseId/statistics')
  .get(protect, getCourseStatistics);

router.route('/:id/download')
  .get(protect, downloadSubmissionFile);

router.route('/:id/grade')
  .put(protect, gradeSubmission);

router.route('/assignment/:id')
  .get(protect, getSubmissionsByAssignment);

module.exports = router;