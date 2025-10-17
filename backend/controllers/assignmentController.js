const asyncHandler = require('../middleware/asyncHandler');
const { getDB } = require('../models/index');

// @desc    Create an assignment
// @route   POST /api/assignments
// @access  Private/Teacher
const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, courseId, dueDate } = req.body;
  const db = getDB();
  const { Assignment, Course } = db;

  const course = await Course.findByPk(courseId);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if user is the teacher of this course
  if (course.teacherId.toString() !== req.user.id.toString()) {
    res.status(401);
    throw new Error('Not authorized to create assignment for this course');
  }

  const assignment = await Assignment.create({
    title,
    description,
    courseId,
    dueDate,
  });

  res.status(201).json(assignment);
});

// @desc    Get assignments for a course
// @route   GET /api/assignments/course/:id
// @access  Private
const getAssignmentsByCourse = asyncHandler(async (req, res) => {
  const db = getDB();
  const { Assignment, Submission } = db;
  
  const assignments = await Assignment.findAll({
    where: { courseId: req.params.id },
    include: [
      {
        model: Submission,
        as: 'submissions',
        attributes: ['id', 'studentId', 'submittedAt', 'grade']
      }
    ],
    order: [['dueDate', 'ASC']]
  });
  
  res.json(assignments);
});

module.exports = {
  createAssignment,
  getAssignmentsByCourse,
};