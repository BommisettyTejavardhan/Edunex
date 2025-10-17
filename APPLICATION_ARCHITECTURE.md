# LMS Application Architecture

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                    http://localhost:3000                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FRONTEND SERVER (Port 3000)                   │
├─────────────────────────────────────────────────────────────────┤
│  Framework: React.js                                            │
│  UI Library: TailwindCSS                                        │
│  Routing: React Router                                          │
│  State: React Hooks + AuthContext                              │
├─────────────────────────────────────────────────────────────────┤
│  Components:                                                     │
│  • Login/Register                                               │
│  • Teacher Dashboard                                            │
│  • Student Dashboard                                            │
│  • Course Management                                            │
│  • Assignment System                                            │
│  • Enrollment System                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ API Requests (Proxied)
                         │ /api/* → localhost:5000
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND SERVER (Port 5000)                    │
├─────────────────────────────────────────────────────────────────┤
│  Framework: Express.js                                          │
│  Runtime: Node.js                                               │
│  Authentication: JWT (JSON Web Tokens)                          │
│  Password Hashing: bcryptjs                                     │
├─────────────────────────────────────────────────────────────────┤
│  API Routes:                                                     │
│  • /api/auth (register, login)                                 │
│  • /api/courses (CRUD operations)                              │
│  • /api/enroll (enrollment management)                         │
│  • /api/assignments (assignment management)                    │
│  • /api/submissions (submission & grading)                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Database Operations
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MOCK DATABASE                              │
├─────────────────────────────────────────────────────────────────┤
│  Type: In-Memory (Development)                                  │
│  Models:                                                         │
│  • MockUser (teachers, students)                                │
│  • MockCourse (course information)                              │
│  • MockAssignment (assignments)                                 │
│  • MockSubmission (student submissions)                         │
├─────────────────────────────────────────────────────────────────┤
│  Sample Data:                                                    │
│  • 1 Teacher (Dr. Smith)                                        │
│  • 3 Courses (React, JavaScript, UI/UX)                        │
│  • Dynamic student enrollments                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### Authentication Flow
```
User Login Request
    ↓
Frontend: POST /api/auth/login
    ↓
Backend: Verify credentials
    ↓
Generate JWT Token
    ↓
Return token + user info
    ↓
Frontend: Store token in localStorage
    ↓
Include token in all subsequent requests
```

### Enrollment Flow (Real-time Visibility)
```
Student: Click "Enroll"
    ↓
Frontend: POST /api/enroll/:courseId
    ↓
Backend: Verify student authentication
    ↓
Database: Add student to course.students array
    ↓
Record enrollment timestamp
    ↓
Return success confirmation
    ↓
Teacher: GET /api/enroll/students/:id/details
    ↓
Backend: Fetch enrolled students
    ↓
Return student list with details
    ↓
Teacher Dashboard: Display immediately
```

### Assignment Submission Flow
```
Student: Submit assignment
    ↓
Frontend: POST /api/submissions
    ↓
Backend: Verify student enrolled in course
    ↓
Database: Create submission record
    ↓
Teacher: GET /api/submissions/assignment/:id
    ↓
Backend: Fetch all submissions
    ↓
Teacher: View and grade submissions
    ↓
Backend: PUT /api/submissions/:id/grade
    ↓
Database: Update submission with grade
```

---

## 📡 API Communication

### Request Headers
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response Format
```javascript
// Success Response
{
  "status": "success",
  "data": { ... }
}

// Error Response
{
  "message": "Error description",
  "stack": "Error stack trace (dev only)"
}
```

---

## 🔐 Security Layers

1. **JWT Authentication**
   - Token-based authentication
   - Tokens expire after 30 days
   - Stored in localStorage

2. **Password Security**
   - Bcrypt hashing (10 rounds)
   - Passwords never stored in plain text

3. **Role-Based Access Control**
   - Teacher-only routes protected
   - Student-only routes protected
   - Authorization middleware checks

4. **CORS Protection**
   - Cross-Origin Resource Sharing enabled
   - Configured for development

---

## 🗂️ File Structure

```
lms3/
├── backend/
│   ├── controllers/        # Request handlers
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & error handling
│   ├── config/            # Database config
│   └── server.js          # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Global state
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── public/            # Static assets
│
└── test files/            # Integration tests
```

---

## 🚀 Deployment Architecture

### Development (Current)
- Frontend: localhost:3000
- Backend: localhost:5000
- Database: Mock (in-memory)

### Production (Recommended)
- Frontend: Netlify/Vercel
- Backend: Render/Railway
- Database: MongoDB Atlas

---

## 📊 Performance Considerations

1. **Caching**: User data cached in localStorage
2. **Lazy Loading**: Components loaded on demand
3. **Optimistic Updates**: UI updates before server confirmation
4. **Error Boundaries**: Graceful error handling

---

## 🔧 Technology Stack

### Frontend
- **React 19.2.0** - UI framework
- **React Router 7.9.4** - Client-side routing
- **TailwindCSS 3.4.18** - Styling
- **Framer Motion 12.23.24** - Animations

### Backend
- **Express 5.1.0** - Web framework
- **Node.js** - Runtime environment
- **JWT** - Authentication
- **Bcryptjs** - Password hashing

### Development Tools
- **React Scripts 5.0.1** - Build tooling
- **Nodemon** - Auto-restart (backend)

---

*This architecture ensures a scalable, secure, and maintainable LMS application.*
