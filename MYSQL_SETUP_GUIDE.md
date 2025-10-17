# MySQL Database Setup Guide for LMS Application

## Prerequisites

1. **MySQL Server** must be installed on your laptop
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or install via package manager (Windows: Chocolatey, Mac: Homebrew)

2. **MySQL Running** - Make sure MySQL server is running
   - Windows: Check Services (services.msc) for "MySQL" service
   - Mac/Linux: `sudo systemctl status mysql`

## Step 1: Create Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE lms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or use the provided script:
```bash
mysql -u root -p < create-database.sql
```

## Step 2: Configure Database Connection

Edit `backend/.env` file with your MySQL credentials:

```env
# MySQL Configuration
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lms_db
DB_USER=root
DB_PASSWORD=your_mysql_password
```

**Important**: Replace `your_mysql_password` with your actual MySQL root password.
If you don't have a password, leave it empty: `DB_PASSWORD=`

## Step 3: Install Dependencies

The MySQL packages are already installed:
- `mysql2` - MySQL client for Node.js
- `sequelize` - ORM for MySQL

If you need to reinstall:
```bash
cd backend
npm install mysql2 sequelize
```

## Step 4: Start the Server

```bash
cd backend
npm start
```

You should see:
```
✅ Server running on port 5000
✅ MySQL database connection established successfully
✅ Database tables synchronized
✅ MySQL models initialized and associations created
```

## Database Tables Created

The application will automatically create these tables:

1. **users** - Stores user accounts (students and teachers)
   - id, name, email, password, role, createdAt, updatedAt

2. **courses** - Stores course information
   - id, title, description, duration, enrollmentDeadline, teacherId, createdAt, updatedAt

3. **enrollments** - Tracks student enrollments in courses
   - id, studentId, courseId, enrolledAt, createdAt, updatedAt

4. **assignments** - Stores course assignments
   - id, title, description, dueDate, courseId, createdAt, updatedAt

5. **submissions** - Stores student assignment submissions
   - id, assignmentId, studentId, fileUrl, submittedAt, grade, feedback, createdAt, updatedAt

## Sample Data

The application will automatically create sample data on first run:

**Teacher Account:**
- Email: teacher@example.com
- Password: password123

**Student Account:**
- Email: student@example.com
- Password: password123

**Courses:**
- Introduction to React (12 hours)
- Advanced JavaScript (15 hours)
- UI/UX Design Principles (10 hours)

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
- Solution: Update `DB_PASSWORD` in `.env` with correct MySQL password

### Error: "Unknown database 'lms_db'"
- Solution: Run `CREATE DATABASE lms_db;` in MySQL

### Error: "connect ECONNREFUSED"
- Solution: Make sure MySQL server is running
- Windows: Start MySQL service in Services
- Mac/Linux: `sudo systemctl start mysql`

### Error: "Client does not support authentication protocol"
- Solution: Run this in MySQL:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

## Switching Back to Mock Database

If you want to use mock database instead of MySQL:

1. In `server.js`, change the import:
```javascript
const connectDB = require('./config/db'); // Mock DB
// const { initializeModels } = require('./models/index'); // MySQL
```

2. Update the connection call accordingly

## Verify Connection

Access: http://localhost:5000

You should see:
```json
{
  "message": "LMS API Running",
  "database": "MySQL Connected",
  "dbType": "mysql"
}
```

## Database Management

### View Tables
```sql
USE lms_db;
SHOW TABLES;
```

### View Data
```sql
SELECT * FROM users;
SELECT * FROM courses;
SELECT * FROM enrollments;
```

### Reset Database
```sql
DROP DATABASE lms_db;
CREATE DATABASE lms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Then restart the server to recreate tables and sample data.

## Production Considerations

For production deployment:

1. Create a separate MySQL user (not root):
```sql
CREATE USER 'lms_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON lms_db.* TO 'lms_user'@'localhost';
FLUSH PRIVILEGES;
```

2. Update `.env`:
```env
DB_USER=lms_user
DB_PASSWORD=strong_password
```

3. Enable SSL for database connections
4. Set up regular database backups
5. Use environment-specific configuration files

---

**Status**: MySQL integration complete ✅  
**Database**: MySQL (Sequelize ORM)  
**Auto-migration**: Enabled (tables created automatically)  
**Sample data**: Auto-populated on first run
