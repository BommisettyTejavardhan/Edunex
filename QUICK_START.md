# 🚀 Quick Start Guide - Assignment Submission Feature

## Prerequisites
- ✅ MySQL installed and running on your laptop
- ✅ Node.js installed
- ✅ Know your MySQL root password

## Step 1: Configure MySQL Password

Edit `backend/.env` file and set your MySQL password:

```env
DB_PASSWORD=your_mysql_password_here
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

If you don't have a MySQL password, leave it empty:
```env
DB_PASSWORD=
```

## Step 2: Setup Database

Run the database setup script:

```bash
cd backend
node setup-database.js
```

This will:
- Create the `lms_db` database
- Prepare for table creation

## Step 3: Start Backend Server

```bash
cd backend
npm start
```

The server will:
- Connect to MySQL
- Create all tables (users, courses, assignments, submissions, enrollments)
- Populate sample data
- Run on http://localhost:5000

## Step 4: Start Frontend Server

Open a **new terminal** and run:

```bash
cd frontend
npm start
```

The frontend will run on http://localhost:3000

## Step 5: Test the Assignment Submission Feature

### As a Teacher:

1. **Login** with teacher credentials:
   - Email: `teacher@example.com`
   - Password: `password123`

2. **Create an Assignment**:
   - Go to "My Courses"
   - Select a course
   - Click "Create Assignment"
   - Fill in: Title, Description, Due Date
   - Submit

3. **View Submissions**:
   - Click on the assignment
   - See all student submissions in real-time
   - Student info, submission time, and content visible

4. **Grade Submissions**:
   - Enter grade (0-100)
   - Add optional feedback
   - Click "Submit Grade"
   - Student sees grade immediately

### As a Student:

1. **Login** with student credentials:
   - Email: `student@example.com`
   - Password: `password123`

2. **View Assignments**:
   - Go to "My Courses"
   - Select enrolled course
   - See all assignments with status badges

3. **Submit Assignment**:
   - Write content in textarea
   - Click "Submit Assignment"
   - See confirmation
   - Status updates to "Submitted - Pending Review"

4. **View Grade**:
   - After teacher grades, status shows "Graded: XX/100"
   - View teacher feedback if provided

## Alternative: Run Automated Test

Run the comprehensive test script:

```bash
node test-assignment-submission.js
```

This will test:
- Teacher login and assignment creation
- Student enrollment and submission
- Real-time visibility
- Grading functionality

## Troubleshooting

### MySQL Connection Failed
- Ensure MySQL is running
- Check `DB_PASSWORD` in `backend/.env`
- Verify MySQL is on default port 3306

### Port Already in Use
- Backend (5000): Stop other Node processes
- Frontend (3000): Use alternative port: `$env:PORT=3002; npm start`

### Tables Not Created
- Restart backend server after MySQL connection is successful
- Tables are created automatically on first successful connection

## Key Features

✅ **Real-time Visibility** - Teachers see submissions instantly
✅ **Status Tracking** - Visual indicators for all states
✅ **Timestamp Tracking** - Precise submission times
✅ **Grading System** - 0-100 scale with feedback
✅ **Duplicate Prevention** - One submission per assignment
✅ **Instant Feedback** - Grades visible immediately

## Default Credentials

**Teacher Account:**
- Email: teacher@example.com
- Password: password123

**Student Account:**
- Email: student@example.com  
- Password: password123

---

Need help? Check `ASSIGNMENT_SUBMISSION_FEATURE.md` for detailed documentation!
