# Quick MySQL Setup Instructions

## 🔧 Configure Your MySQL Password

Edit the file: `backend\.env`

Find this line:
```env
DB_PASSWORD=
```

And update it with your MySQL password:
```env
DB_PASSWORD=your_mysql_password_here
```

**If you don't have a MySQL password:**
Leave it empty: `DB_PASSWORD=`

**If you're not sure what your password is:**

### For Windows:
1. Open MySQL Command Line Client or MySQL Workbench
2. Try logging in with no password (just press Enter)
3. If that works, leave `DB_PASSWORD=` empty in .env
4. If not, try common passwords: `root`, `password`, `admin`

### For Mac/Linux:
```bash
mysql -u root -p
# Enter your password when prompted
```

## 🎯 Once Password is Set

Run these commands:

```bash
# 1. Setup database
cd backend
node setup-database.js

# 2. Start server (will create tables and sample data)
npm start
```

## ✅ What Will Happen

1. Database `lms_db` will be created
2. Tables will be created automatically (users, courses, enrollments, etc.)
3. Sample data will be added:
   - Teacher: teacher@example.com / password123
   - Student: student@example.com / password123
   - 3 sample courses

## 🌐 Verify

Visit: http://localhost:5000

You should see:
```json
{
  "message": "LMS API Running",
  "database": "MySQL Connected",
  "dbType": "mysql"
}
```

## ⚙️ Alternative: Use Mock Database (No MySQL Required)

If you prefer not to use MySQL right now, the application can still run with mock database.
Just keep using the current setup - no changes needed!
