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

// @desc    Get student grades by course
// @route   GET /api/submissions/course/:courseId/grades
// @access  Private/Student
const getCourseGrades = asyncHandler(async (req, res) => {
  const db = getDB();
  const { Submission, Assignment } = db;
  
  const submissions = await Submission.findAll({
    where: { studentId: req.user.id },
    include: [
      {
        model: Assignment,
        as: 'assignment',
        where: { courseId: req.params.courseId },
        attributes: ['id', 'title', 'dueDate', 'courseId']
      }
    ],
    order: [['submittedAt', 'DESC']]
  });
  
  // Calculate average grade
  const gradedSubmissions = submissions.filter(s => s.grade !== null && s.grade !== undefined);
  const averageGrade = gradedSubmissions.length > 0
    ? gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) / gradedSubmissions.length
    : null;
  
  res.json({
    submissions,
    totalSubmissions: submissions.length,
    gradedSubmissions: gradedSubmissions.length,
    averageGrade: averageGrade ? Math.round(averageGrade * 10) / 10 : null
  });
});

// @desc    Get all grades for a student (across all courses)
// @route   GET /api/submissions/student/all-grades
// @access  Private/Student
const getAllStudentGrades = asyncHandler(async (req, res) => {
  const db = getDB();
  const { Submission, Assignment, Course } = db;
  
  const submissions = await Submission.findAll({
    where: { 
      studentId: req.user.id,
      grade: { [db.sequelize.Sequelize.Op.ne]: null }
    },
    include: [
      {
        model: Assignment,
        as: 'assignment',
        attributes: ['id', 'title', 'dueDate', 'courseId'],
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
  
  // Group by course
  const courseGrades = {};
  submissions.forEach(sub => {
    const courseId = sub.assignment.course.id;
    if (!courseGrades[courseId]) {
      courseGrades[courseId] = {
        courseId,
        courseTitle: sub.assignment.course.title,
        grades: [],
        total: 0,
        count: 0
      };
    }
    courseGrades[courseId].grades.push({
      assignmentTitle: sub.assignment.title,
      grade: sub.grade,
      feedback: sub.feedback,
      submittedAt: sub.submittedAt
    });
    courseGrades[courseId].total += sub.grade;
    courseGrades[courseId].count += 1;
  });
  
  // Calculate averages
  Object.keys(courseGrades).forEach(courseId => {
    courseGrades[courseId].average = Math.round(
      (courseGrades[courseId].total / courseGrades[courseId].count) * 10
    ) / 10;
  });
  
  // Calculate overall average
  const totalGrades = submissions.reduce((sum, s) => sum + s.grade, 0);
  const overallAverage = submissions.length > 0
    ? Math.round((totalGrades / submissions.length) * 10) / 10
    : null;
  
  res.json({
    courseGrades: Object.values(courseGrades),
    overallAverage,
    totalAssignments: submissions.length
  });
});

// @desc    Get grade statistics for teacher's course
// @route   GET /api/submissions/course/:courseId/statistics
// @access  Private/Teacher
const getCourseStatistics = asyncHandler(async (req, res) => {
  const db = getDB();
  const { Submission, Assignment, User, Course } = db;
  
  // Verify teacher owns the course
  const course = await Course.findByPk(req.params.courseId);
  if (!course || course.teacherId.toString() !== req.user.id.toString()) {
    res.status(401);
    throw new Error('Not authorized to view these statistics');
  }
  
  // Get all assignments for the course
  const assignments = await Assignment.findAll({
    where: { courseId: req.params.courseId },
    include: [
      {
        model: Submission,
        as: 'submissions',
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'name', 'email']
          }
        ]
      }
    ]
  });
  
  // Calculate statistics
  let totalSubmissions = 0;
  let gradedSubmissions = 0;
  let totalGradeSum = 0;
  const studentGrades = {};
  
  assignments.forEach(assignment => {
    assignment.submissions.forEach(sub => {
      totalSubmissions++;
      if (sub.grade !== null && sub.grade !== undefined) {
        gradedSubmissions++;
        totalGradeSum += sub.grade;
        
        // Track student grades
        const studentId = sub.studentId;
        if (!studentGrades[studentId]) {
          studentGrades[studentId] = {
            studentId,
            studentName: sub.student.name,
            studentEmail: sub.student.email,
            grades: [],
            total: 0,
            count: 0
          };
        }
        studentGrades[studentId].grades.push(sub.grade);
        studentGrades[studentId].total += sub.grade;
        studentGrades[studentId].count += 1;
      }
    });
  });
  
  // Calculate student averages
  Object.keys(studentGrades).forEach(studentId => {
    studentGrades[studentId].average = Math.round(
      (studentGrades[studentId].total / studentGrades[studentId].count) * 10
    ) / 10;
  });
  
  const averageGrade = gradedSubmissions > 0
    ? Math.round((totalGradeSum / gradedSubmissions) * 10) / 10
    : null;
  
  res.json({
    totalAssignments: assignments.length,
    totalSubmissions,
    gradedSubmissions,
    pendingGrading: totalSubmissions - gradedSubmissions,
    averageGrade,
    studentGrades: Object.values(studentGrades),
    assignments: assignments.map(a => ({
      id: a.id,
      title: a.title,
      submissionCount: a.submissions.length,
      gradedCount: a.submissions.filter(s => s.grade !== null).length
    }))
  });
});

module.exports = {
  submitAssignment,
  submitAssignmentWithFile,
  downloadSubmissionFile,
  gradeSubmission,
  getSubmissionsByAssignment,
  getMySubmissions,
  getCourseGrades,
  getAllStudentGrades,
  getCourseStatistics,
};