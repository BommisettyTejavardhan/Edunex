const express = require('express');
const { submitAssignment, submitAssignmentWithFile, downloadSubmissionFile, gradeSubmission, getSubmissionsByAssignment, getMySubmissions } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .post(protect, submitAssignment);

router.route('/upload')
  .post(protect, upload.single('file'), submitAssignmentWithFile);

router.route('/my')
  .get(protect, getMySubmissions);

router.route('/:id/download')
  .get(protect, downloadSubmissionFile);

router.route('/:id/grade')
  .put(protect, gradeSubmission);

router.route('/assignment/:id')
  .get(protect, getSubmissionsByAssignment);

module.exports = router;