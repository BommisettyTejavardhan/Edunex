# LMS Application - Local Development Setup

## ✅ Application Status: RUNNING

### Server Information

#### Backend Server
- **URL**: http://localhost:5000
- **Status**: ✅ Running
- **Database**: Mock database (in-memory)
- **Port**: 5000

#### Frontend Server
- **URL**: http://localhost:3000
- **Status**: ✅ Running
- **Framework**: React.js
- **Port**: 3000

### Connection Status
✅ Backend server is accessible
✅ Frontend server is accessible
✅ Frontend is properly configured to proxy API requests to backend (port 5000)

---

## 🚀 Accessing the Application

### Web Browser Access
1. **Frontend Application**: Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

2. **Backend API**: The backend API is available at:
   ```
   http://localhost:5000
   ```

### Preview Browser
A preview browser has been set up for easy access. Click the "Preview" button in the tool panel to view the application.

---

## 👤 Test Credentials

### Teacher Account (Pre-created)
- **Email**: teacher@example.com
- **Password**: password123
- **Role**: Teacher
- **Access**: Can create courses, assignments, and grade submissions

### Student Account
- **Create via Registration**: Use the registration page to create a new student account
- **Role**: Student
- **Access**: Can enroll in courses and submit assignments

---

## 📚 Available Sample Data

The application has been initialized with sample data:

### Courses (3 available)
1. **Introduction to React** (12 hours)
   - Enrollment Deadline: October 22, 2025
   
2. **Advanced JavaScript** (15 hours)
   - Enrollment Deadline: October 27, 2025
   
3. **UI/UX Design Principles** (10 hours)
   - Enrollment Deadline: October 19, 2025

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Teacher only)
- `PUT /api/courses/:id` - Update course (Teacher only)

### Enrollment
- `POST /api/enroll/:id` - Enroll in course
- `GET /api/enroll/mycourses` - Get enrolled courses (Student)
- `GET /api/enroll/students/:id` - Get students in course (Teacher)

### Assignments
- `POST /api/assignments` - Create assignment (Teacher)
- `GET /api/assignments/course/:id` - Get assignments for course

### Submissions
- `POST /api/submissions` - Submit assignment (Student)
- `GET /api/submissions/my` - Get my submissions (Student)
- `GET /api/submissions/assignment/:id` - Get submissions (Teacher)
- `PUT /api/submissions/:id/grade` - Grade submission (Teacher)

---

## 🛠️ Development Commands

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm start
```

### Stop Servers
To stop the servers, press `Ctrl+C` in the terminal windows where they are running.

---

## 🎯 Next Steps

1. **Access the Application**: Open http://localhost:3000 in your web browser
2. **Login**: Use the teacher credentials to explore teacher features
3. **Register**: Create a student account to test student features
4. **Test Features**:
   - Create courses (as teacher)
   - Enroll in courses (as student)
   - Create assignments (as teacher)
   - Submit assignments (as student)
   - Grade submissions (as teacher)

---

## 📝 Notes

- The application is using a **mock database** (in-memory storage)
- Data will be reset when the backend server is restarted
- For production use, configure MongoDB connection in `.env` file
- The frontend proxy is configured to route API requests to http://localhost:5000

---

## ✨ Features Available

### Teacher Features
- ✅ Create and manage courses
- ✅ View enrolled students
- ✅ Create assignments
- ✅ View and grade student submissions
- ✅ Track student progress

### Student Features
- ✅ Browse available courses
- ✅ Enroll in courses
- ✅ View enrolled courses
- ✅ Submit assignments
- ✅ View grades and feedback

---

Happy Learning! 🎓
