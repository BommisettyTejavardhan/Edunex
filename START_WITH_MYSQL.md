# 🚀 Start LMS Application with MySQL

## Step-by-Step Guide

### Step 1: Configure MySQL Password

**Option A - Use the configuration script (Easiest):**
```cmd
cd d:\lms3\backend
configure-mysql.bat
```
Follow the prompts to enter your MySQL password.

**Option B - Manual configuration:**
1. Open `d:\lms3\backend\.env`
2. Find the line: `DB_PASSWORD=`
3. Update it with your password: `DB_PASSWORD=your_password`
4. Save the file

**If you don't have a MySQL password:**
- Leave it blank: `DB_PASSWORD=`

---

### Step 2: Create Database

Run the database setup script:
```cmd
cd d:\lms3\backend
node setup-database.js
```

You should see:
```
✅ Connected to MySQL server
✅ Database 'lms_db' created/verified
✅ Database setup complete!
```

---

### Step 3: Start Backend Server

```cmd
cd d:\lms3\backend
npm start
```

You should see:
```
✅ MySQL database connection established successfully
✅ Database tables synchronized
✅ MySQL models initialized and associations created
✅ Server running on port 5000
✅ MySQL database connected successfully
```

**Sample data created:**
- Teacher: teacher@example.com / password123
- Student: student@example.com / password123
- 3 Courses: React, JavaScript, UI/UX

---

### Step 4: Start Frontend

**In a new terminal:**
```cmd
cd d:\lms3\frontend
npm start
```

You should see:
```
Compiled successfully!
You can now view frontend in the browser.
  Local:            http://localhost:3000
```

---

### Step 5: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

**Test Credentials:**
- **Teacher**: teacher@example.com / password123
- **Student**: student@example.com / password123

---

## ✅ Verification

### Check Backend Connection
Visit: `http://localhost:5000`

Expected response:
```json
{
  "message": "LMS API Running",
  "database": "MySQL Connected",
  "dbType": "mysql",
  "dbName": "lms_db"
}
```

### Check MySQL Tables
Open MySQL and run:
```sql
USE lms_db;
SHOW TABLES;
```

You should see:
```
+--------------------+
| Tables_in_lms_db   |
+--------------------+
| assignments        |
| courses            |
| enrollments        |
| submissions        |
| users              |
+--------------------+
```

---

## 🔧 Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
**Solution:**
1. Check your MySQL password
2. Update `DB_PASSWORD` in `.env` file
3. Run `configure-mysql.bat` again

### Error: "MySQL connection failed"
**Solution:**
1. Check if MySQL is running:
   - Windows: Open Services → Find "MySQL" → Start
   - Check status: `netstat -ano | findstr :3306`
2. Verify MySQL credentials
3. Run: `node setup-database.js`

### Error: "Unknown database 'lms_db'"
**Solution:**
```cmd
cd backend
node setup-database.js
```

### Error: "Application requires MySQL database to run"
**Solution:**
This is the expected behavior! The app will NOT run without MySQL.
1. Make sure MySQL is installed and running
2. Configure your password in `.env`
3. Create the database with `node setup-database.js`

---

## 📊 Database Schema

### Users Table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, HASHED)
- role (ENUM: 'Student', 'Teacher')
- createdAt, updatedAt (TIMESTAMP)

### Courses Table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- title (VARCHAR)
- description (TEXT)
- duration (INT)
- enrollmentDeadline (DATE)
- teacherId (INT, FOREIGN KEY → users.id)
- createdAt, updatedAt (TIMESTAMP)

### Enrollments Table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- studentId (INT, FOREIGN KEY → users.id)
- courseId (INT, FOREIGN KEY → courses.id)
- enrolledAt (DATE)
- createdAt, updatedAt (TIMESTAMP)
- UNIQUE (studentId, courseId)

### Assignments Table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- title (VARCHAR)
- description (TEXT)
- dueDate (DATE)
- courseId (INT, FOREIGN KEY → courses.id)
- createdAt, updatedAt (TIMESTAMP)

### Submissions Table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- assignmentId (INT, FOREIGN KEY → assignments.id)
- studentId (INT, FOREIGN KEY → users.id)
- fileUrl (VARCHAR)
- submittedAt (DATE)
- grade (INT, 0-100)
- feedback (TEXT)
- createdAt, updatedAt (TIMESTAMP)

---

## 🎯 Quick Commands

```cmd
# Configure MySQL
cd d:\lms3\backend
configure-mysql.bat

# Setup Database
node setup-database.js

# Start Backend
npm start

# Start Frontend (new terminal)
cd d:\lms3\frontend
npm start

# View Database
mysql -u root -p
USE lms_db;
SHOW TABLES;
SELECT * FROM users;
```

---

## ⚠️ Important Notes

1. **MySQL Required**: The application will NOT run without MySQL. Mock database has been disabled.
2. **Password**: Make sure to set your MySQL password in `.env` file
3. **Port 3306**: MySQL must be running on default port 3306
4. **Data Persistence**: All data is stored in MySQL and persists across restarts
5. **Sample Data**: Created automatically on first run

---

**Status**: MySQL-only configuration ✅  
**Mock Database**: Disabled ❌  
**Fallback**: None - MySQL required
