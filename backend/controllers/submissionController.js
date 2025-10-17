const asyncHandler = require('../middleware/asyncHandler');
const { getDB } = require('../models/index');
const path = require('path');

// @desc    Submit an assignment (text only)
// @route   POST /api/submissions
// @access  Private/Student
const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId, content } = req.body;
  const db = getDB();
  const { Assignment, Submission, User } = db;

  const assignment = await Assignment.findByPk(assignmentId);

  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  // Check if student has already submitted
  const existingSubmission = await Submission.findOne({
    where: {
      assignmentId: assignmentId,
      studentId: req.user.id,
    }
  });

  if (existingSubmission) {
    res.status(400);
    throw new Error('Assignment already submitted');
  }

  const submission = await Submission.create({
    assignmentId: assignmentId,
    studentId: req.user.id,
    content: content || '',
    submittedAt: new Date()
  });

  // Fetch student info for response
  const submissionWithDetails = await Submission.findByPk(submission.id, {
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email']
      },
      {
        model: Assignment,
        as: 'assignment',
        attributes: ['id', 'title', 'dueDate']
      }
    ]
  });

  res.status(201).json(submissionWithDetails);
});

// @desc    Submit an assignment with file upload
// @route   POST /api/submissions/upload
// @access  Private/Student
const submitAssignmentWithFile = asyncHandler(async (req, res) => {
  const { assignmentId, content } = req.body;
  const db = getDB();
  const { Assignment, Submission, User } = db;

  const assignment = await Assignment.findByPk(assignmentId);

  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  // Check if student has already submitted
  const existingSubmission = await Submission.findOne({
    where: {
      assignmentId: assignmentId,
      studentId: req.user.id,
    }
  });

  if (existingSubmission) {
    res.status(400);
    throw new Error('Assignment already submitted');
  }

  // Get file URL if file was uploaded
  const fileUrl = req.file ? `/uploads/assignments/${req.file.filename}` : null;

  const submission = await Submission.create({
    assignmentId: assignmentId,
    studentId: req.user.id,
    content: content || '',
    fileUrl: fileUrl,
    submittedAt: new Date()
  });

  // Fetch student info for response
  const submissionWithDetails = await Submission.findByPk(submission.id, {
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email']
      },
      {
        model: Assignment,
        as: 'assignment',
        attributes: ['id', 'title', 'dueDate']
      }
    ]
  });

  res.status(201).json(submissionWithDetails);
});

// @desc    Download submission file
// @route   GET /api/submissions/:id/download
// @access  Private (Student who submitted or Teacher of the course)
const downloadSubmissionFile = asyncHandler(async (req, res) => {
  const db = getDB();
  const { Submission, Assignment, Course } = db;

  const submission = await Submission.findByPk(req.params.id, {
    include: [
      {
        model: Assignment,
        as: 'assignment',
        include: [
          {
            model: Course,
            as: 'course'
          }
        ]
      }
    ]
  });

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  // Check authorization: student who submitted or teacher of the course
  const isStudent = submission.studentId.toString() === req.user.id.toString();
  const isTeacher = submission.assignment.course.teacherId.toString() === req.user.id.toString();

  if (!isStudent && !isTeacher) {
    res.status(401);
    throw new Error('Not authorized to download this file');
  }

  if (!submission.fileUrl) {
    res.status(404);
    throw new Error('No file attached to this submission');
  }

  const filePath = path.join(__dirname, '..', submission.fileUrl);
  res.download(filePath);
});

// @desc    Grade a submission
// @route   PUT /api/submissions/:id/grade
// @access  Private/Teacher
const gradeSubmission = asyncHandler(async (req, res) => {
  const { grade, feedback } = req.body;
  const db = getDB();
  const { Submission, Assignment, User, Course } = db;

  const submission = await Submission.findByPk(req.params.id, {
    include: [
      {
        model: Assignment,
        as: 'assignment',
        include: [
          {
            model: Course,
            as: 'course'
          }
        ]
      }
    ]
  });

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  // Check if user is the teacher who owns the course
  if (submission.assignment.course.teacherId.toString() !== req.user.id.toString()) {
    res.status(401);
    throw new Error('Not authorized to grade this submission');
  }

  submission.grade = grade;
  submission.feedback = feedback || null;
  await submission.save();

  // Return submission with student details
  const updatedSubmission = await Submission.findByPk(submission.id, {
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email']
      },
      {
        model: Assignment,
        as: 'assignment',
        attributes: ['id', 'title', 'dueDate']
      }
    ]
  });

  res.json(updatedSubmission);
});

// @desc    Get submissions for an assignment
// @route   GET /api/submissions/assignment/:id
// @access  Private/Teacher
const getSubmissionsByAssignment = asyncHandler(async (req, res) => {
  const db = getDB();
  const { Submission, User, Assignment } = db;
  
  const submissions = await Submission.findAll({
    where: { assignmentId: req.params.id },
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email']
      },
      {
        model: Assignment,
        as: 'assignment',
        attributes: ['id', 'title', 'dueDate']
      }
    ],
    order: [['submittedAt', 'DESC']]
  });
  
  res.json(submissions);
});

// @desc    Get my submissions
// @route   GET /api/submissions/my
// @access  Private/Student
const getMySubmissions = asyncHandler(async (req, res) => {
  const db = getDB();
  const { Submission, Assignment, Course } = db;
  
  const submissions = await Submission.findAll({
    where: { studentId: req.user.id },
    include: [
      {
        model: Assignment,
        as: 'assignment',
        attributes: ['id', 'title', 'description', 'dueDate'],
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title']
          }
        ]
      }
    ],
    order: [['submittedAt', 'DESC']]
  });
  
  res.json(submissions);
});

module.exports = {
  submitAssignment,
  submitAssignmentWithFile,
  downloadSubmissionFile,
  gradeSubmission,
  getSubmissionsByAssignment,
  getMySubmissions,
};