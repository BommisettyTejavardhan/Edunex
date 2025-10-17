// mock-user.js
const bcrypt = require('bcryptjs');
const mockDB = require('../mock-db');

class MockUser {
  constructor(data) {
    this._id = data._id || null;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Mock save method
  async save() {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password, // Don't hash here, let mockDB handle it
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: new Date()
    };
    
    // Only include _id in userData if it's not null
    if (this._id) {
      userData._id = this._id;
    }
    
    const result = await mockDB.create('users', userData);
    // Update this instance with the result (including the assigned ID)
    if (result) {
      this._id = result._id;
      this.updatedAt = result.updatedAt;
    }
    return this;
  }

  // Compare password method
  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  // Mock static methods
  static async findOne(query) {
    const user = await mockDB.findOne('users', query);
    return user ? new MockUser(user) : null;
  }

  static async findById(id) {
    // For mock DB, we need to search by _id
    const users = mockDB.users;
    const user = users.find(u => u._id == id);
    return user ? new MockUser(user) : null;
  }

  static async create(userData) {
    // Create a new user instance
    const newUser = new MockUser({
      _id: null, // Will be assigned by mockDB
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Save the user and return the result with the assigned ID
    const savedUser = await newUser.save();
    return savedUser;
  }
  
  // Method to get all users
  static getUsers() {
    return mockDB.getAll('users') || {};
  }
}

module.exports = MockUser;