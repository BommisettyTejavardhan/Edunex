# 🎓 Edunex - Learning Management System

A comprehensive, full-stack Learning Management System built with React.js, Node.js/Express, and MySQL.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.x-blue)

## 🌟 Features

### For Teachers
- ✅ **Comprehensive Dashboard** - Overview of courses, students, assignments, and grading
- ✅ **Course Management** - Create and manage courses with enrollment tracking
- ✅ **Assignment Creation** - Create assignments with due dates
- ✅ **Submission Review** - View and grade student submissions in real-time
- ✅ **File Downloads** - Download student-submitted files
- ✅ **Student Analytics** - Track enrollment and performance
- ✅ **Search & Filter** - Find students across all courses

### For Students
- ✅ **Course Enrollment** - Browse and enroll in available courses
- ✅ **Assignment Viewing** - See all assignments with due dates
- ✅ **Flexible Submissions** - Submit text, files, or both
- ✅ **File Upload Support** - Upload PDF, DOC, DOCX, XLS, PPT, images, ZIP files (up to 10MB)
- ✅ **Grade Viewing** - See grades and teacher feedback
- ✅ **Status Tracking** - Real-time status indicators (Not Submitted, Submitted, Graded, Overdue)

### System Features
- ✅ **Real-Time Updates** - Instant visibility of submissions and grades
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-Based Access** - Teacher and Student roles with appropriate permissions
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **MySQL Database** - Reliable data persistence with Sequelize ORM
- ✅ **File Management** - Secure file storage and retrieval

## 🚀 Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Framer Motion** - Animations
- **TailwindCSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/BommisettyTejavardhan/Edunex.git
cd Edunex
```

### 2. Install dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Configure MySQL

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000

# MySQL Configuration
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lms_db
DB_USER=root
DB_PASSWORD=your_mysql_password_here

# JWT Secret
JWT_SECRET=your_secret_key_here
```

### 4. Setup Database

```bash
cd backend
node setup-database.js
```

## 🎯 Running the Application

### Quick Start (Windows)

Double-click `START_LMS.bat` in the root directory. This will:
1. Prompt for MySQL password
2. Setup the database
3. Start both servers
4. Open the application in your browser

### Manual Start

**Backend (Terminal 1):**
```bash
cd backend
npm start
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

Access the application at: **http://localhost:3000**

## 👥 Default Accounts

### Teacher Account
- **Email:** teacher@example.com
- **Password:** password123

### Student Account
- **Email:** student@example.com
- **Password:** password123

## 📁 Project Structure

```
Edunex/
├── backend/
│   ├── controllers/       # Business logic
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth, upload, error handling
│   ├── uploads/          # Uploaded files
│   └── server.js         # Entry point
├── frontend/
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # React components
│       ├── App.js       # Main component
│       └── index.js     # Entry point
├── docs/                 # Documentation
├── .gitignore
├── README.md
└── START_LMS.bat        # Quick start script
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/teacher` - Get teacher's courses
- `POST /api/courses` - Create course (Teacher)
- `GET /api/courses/:id` - Get course details

### Assignments
- `POST /api/assignments` - Create assignment (Teacher)
- `GET /api/assignments/course/:id` - Get course assignments

### Submissions
- `POST /api/submissions` - Submit assignment (text)
- `POST /api/submissions/upload` - Submit with file
- `GET /api/submissions/my` - Get student's submissions
- `GET /api/submissions/assignment/:id` - Get assignment submissions (Teacher)
- `PUT /api/submissions/:id/grade` - Grade submission (Teacher)
- `GET /api/submissions/:id/download` - Download file

### Enrollment
- `POST /api/enroll` - Enroll in course (Student)
- `GET /api/enroll/students/:id/details` - Get enrolled students (Teacher)

## 📚 Documentation

- [Complete Implementation Guide](./IMPLEMENTATION_COMPLETE.md)
- [File Upload Feature](./FILE_UPLOAD_FEATURE.md)
- [Teacher Dashboard Guide](./TEACHER_DASHBOARD_GUIDE.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Quick Start Guide](./START_HERE_README.md)

## 🧪 Testing

Run the automated test script:

```bash
node test-assignment-submission.js
```

## 🎨 Features Showcase

### Teacher Dashboard
- Course overview with enrollment statistics
- Student directory with search and filter
- Recent assignments display
- Pending grading alerts
- Real-time submission tracking

### Student Interface
- Clean assignment list with status badges
- Drag-and-drop file upload
- Text and file submission support
- Grade and feedback viewing
- Download submitted files

### Assignment Management
- Create assignments with deadlines
- Track submission status
- Grade with scores (0-100) and feedback
- Real-time visibility for teachers

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based access control
- File type validation
- File size limits (10MB)
- SQL injection prevention (Sequelize ORM)
- Authorization checks on all protected routes

## 🌐 Deployment

### Railway Deployment (Recommended)

The easiest way to deploy this application is using Railway:

1. **Run the deployment helper:**
   ```bash
   npm run deploy:railway
   ```

2. **Follow the instructions** in the [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) guide

### Manual Deployment

#### Frontend
- Deploy to Netlify, Vercel, or Railway
- Build command: `npm run build`
- Publish directory: `build`

#### Backend
- Deploy to Heroku, Railway, or Render
- Set environment variables
- Configure MySQL database connection
- See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed instructions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Bommisetty Tejavardhan**
- GitHub: [@BommisettyTejavardhan](https://github.com/BommisettyTejavardhan)

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Express.js community
- MySQL and Sequelize teams
- All open-source contributors

## 📧 Support

For support, email your queries or open an issue in the GitHub repository.

---

**Made with ❤️ for education**
