// MockSubmission.js
// A simple in-memory mock submission model for testing purposes

// In-memory storage for submissions
const submissions = [];
let nextId = 1;

class MockSubmission {
  constructor(data) {
    this._id = data._id || nextId++;
    this.assignment = data.assignment;
    this.student = data.student;
    this.content = data.content;
    this.grade = data.grade || null;
    this.graded = data.graded || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Mock save method
  async save() {
    this.updatedAt = new Date();
    return this;
  }

  // Mock static methods
  static async create(submissionData) {
    // Check if student has already submitted
    const existingSubmission = submissions.find(
      s => s.assignment == submissionData.assignment && s.student == submissionData.student
    );
    
    if (existingSubmission) {
      throw new Error('Assignment already submitted');
    }

    const newSubmission = new MockSubmission({
      assignment: submissionData.assignment,
      student: submissionData.student,
      content: submissionData.content,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    submissions.push(newSubmission);
    return newSubmission;
  }

  static async find(query = {}) {
    if (Object.keys(query).length === 0) {
      return submissions;
    }
    
    // Filter submissions based on query
    return submissions.filter(submission => {
      for (let key in query) {
        if (submission[key] != query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  static async findById(id) {
    return submissions.find(submission => submission._id == id) || null;
  }
  
  static async findByIdAndUpdate(id, updateData) {
    const submissionIndex = submissions.findIndex(submission => submission._id == id);
    if (submissionIndex !== -1) {
      submissions[submissionIndex] = {
        ...submissions[submissionIndex],
        ...updateData,
        updatedAt: new Date()
      };
      return submissions[submissionIndex];
    }
    return null;
  }
  
  static async findOne(query) {
    // Filter submissions based on query
    return submissions.find(submission => {
      for (let key in query) {
        if (submission[key] != query[key]) {
          return false;
        }
      }
      return true;
    }) || null;
  }
}

module.exports = MockSubmission;