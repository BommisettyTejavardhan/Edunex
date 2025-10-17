// mock-db.js
// A simple in-memory mock database for testing purposes

const bcrypt = require('bcryptjs');

class MockDB {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  async connect() {
    console.log('Using mock database for testing');
    return Promise.resolve();
  }

  async findOne(collection, query) {
    if (collection === 'users') {
      const user = this.users.find(user => user.email === query.email) || null;
      return user;
    }
    return null;
  }

  async create(collection, data) {
    if (collection === 'users') {
      // Check if user already exists
      const existingUser = await this.findOne(collection, { email: data.email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password before storing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // Create new user with proper ID assignment
      const newUser = {
        _id: data._id || this.nextId++, // Use provided ID or assign new one
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.users.push(newUser);
      return newUser;
    }
    return null;
  }

  // Method to get all data from a collection
  getAll(collection) {
    if (collection === 'users') {
      const usersObj = {};
      this.users.forEach(user => {
        usersObj[user._id] = user;
      });
      return usersObj;
    }
    return {};
  }
}

module.exports = new MockDB();