// mock-course.js
// A simple in-memory mock course model for testing purposes

// In-memory storage for courses and teachers
const courses = [];
const teachers = {};

class MockCourse {
  constructor(data) {
    this._id = data._id || null;
    this.title = data.title;
    this.description = data.description;
    this.duration = data.duration;
    // Add enrollment deadline field
    this.enrollmentDeadline = data.enrollmentDeadline || null;
    this.teacher = data.teacher;
    // Store students as objects with enrollment dates instead of just IDs
    this.students = data.students || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Mock save method
  async save() {
    // In a real implementation, this would save to a database
    // For mock purposes, we'll just update timestamps
    this.updatedAt = new Date();
    return this;
  }

  // Mock static methods
  static async create(courseData) {
    // Create a new course instance
    const newCourse = new MockCourse({
      _id: Date.now(), // Simple ID generation for mock
      title: courseData.title,
      description: courseData.description,
      duration: courseData.duration,
      // Add enrollment deadline to created courses
      enrollmentDeadline: courseData.enrollmentDeadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
      teacher: courseData.teacher,
      students: courseData.students || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Creating course with data:', courseData);
    console.log('New course enrollment deadline:', newCourse.enrollmentDeadline);
    
    // Add to in-memory storage
    courses.push(newCourse);
    
    return newCourse;
  }

  static async find(query = {}) {
    // For mock purposes, return all courses
    // In a real implementation, this would query the database with filters
    return courses;
  }

  static async findById(id) {
    // For mock purposes, find course by ID
    // In a real implementation, this would query the database
    return courses.find(course => course._id == id) || null;
  }
  
  // Mock update method
  static async findByIdAndUpdate(id, updateData) {
    const courseIndex = courses.findIndex(course => course._id == id);
    if (courseIndex !== -1) {
      // Update the course with new data
      courses[courseIndex] = {
        ...courses[courseIndex],
        ...updateData,
        updatedAt: new Date()
      };
      return courses[courseIndex];
    }
    return null;
  }
  
  // Find courses by teacher
  static async findByTeacher(teacherId) {
    return courses.filter(course => course.teacher == teacherId);
  }
  
  // Add student to course with enrollment date
  static async addStudent(courseId, studentId) {
    const course = courses.find(c => c._id == courseId);
    if (course) {
      // Check if student is already enrolled
      const existingEnrollment = course.students.find(s => (s.id || s) == studentId);
      if (!existingEnrollment) {
        // Add student with enrollment date
        course.students.push({
          id: studentId,
          enrolledAt: new Date()
        });
        course.updatedAt = new Date();
      }
      return course;
    }
    return null;
  }
  
  // Get student IDs from enrollment objects
  static getStudentIds(students) {
    return students.map(s => typeof s === 'object' ? s.id : s);
  }
  
  // Get enrollment date for a student
  static getEnrollmentDate(students, studentId) {
    const enrollment = students.find(s => (typeof s === 'object' ? s.id : s) == studentId);
    return enrollment && typeof enrollment === 'object' ? enrollment.enrolledAt : null;
  }
  
  // Debug method to get all courses
  static getAllCourses() {
    return courses;
  }
}

// Add a static populate method to mimic Mongoose behavior
MockCourse.find = async function(query = {}) {
  const results = courses;
  results.populate = function(path, fields) {
    // Mock populate for all results
    if (path === 'teacher' && fields === 'name') {
      return results.map(course => {
        // For mock purposes, we'll use the actual teacher name if available
        // In a real app, this would come from the database
        console.log('Populating teacher for course:', course._id, 'Teacher ID:', course.teacher, 'Available teachers:', teachers);
        return { 
          ...course, 
          teacher: { name: teachers[course.teacher] || `Teacher ${course.teacher}` }
        };
      });
    }
    return results;
  };
  return results;
};

// Function to register teachers
MockCourse.registerTeacher = function(teacherId, teacherName) {
  console.log(`Registering teacher in MockCourse: ID=${teacherId}, Name=${teacherName}`);
  teachers[teacherId] = teacherName;
  console.log('Teachers after registration:', teachers);
};

// Function to get all teachers
MockCourse.getTeachers = function() {
  return teachers;
};

module.exports = MockCourse;