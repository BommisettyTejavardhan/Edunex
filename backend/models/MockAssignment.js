// MockAssignment.js
// A simple in-memory mock assignment model for testing purposes

// In-memory storage for assignments
const assignments = [];
let nextId = 1;

class MockAssignment {
  constructor(data) {
    this._id = data._id || nextId++;
    this.title = data.title;
    this.description = data.description;
    this.course = data.course;
    this.teacher = data.teacher;
    this.dueDate = data.dueDate;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Mock save method
  async save() {
    this.updatedAt = new Date();
    return this;
  }

  // Mock static methods
  static async create(assignmentData) {
    const newAssignment = new MockAssignment({
      title: assignmentData.title,
      description: assignmentData.description,
      course: assignmentData.course,
      teacher: assignmentData.teacher,
      dueDate: assignmentData.dueDate,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    assignments.push(newAssignment);
    return newAssignment;
  }

  static async find(query = {}) {
    if (Object.keys(query).length === 0) {
      return assignments;
    }
    
    // Filter assignments based on query
    return assignments.filter(assignment => {
      for (let key in query) {
        if (assignment[key] != query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  static async findById(id) {
    return assignments.find(assignment => assignment._id == id) || null;
  }
  
  static async findByIdAndUpdate(id, updateData) {
    const assignmentIndex = assignments.findIndex(assignment => assignment._id == id);
    if (assignmentIndex !== -1) {
      assignments[assignmentIndex] = {
        ...assignments[assignmentIndex],
        ...updateData,
        updatedAt: new Date()
      };
      return assignments[assignmentIndex];
    }
    return null;
  }
}

module.exports = MockAssignment;