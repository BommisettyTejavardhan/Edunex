# 🚀 Quick Start - Running LMS Locally

## ⚡ **Fastest Way to Run (1 Click!)**

### **Double-click this file:**
```
📁 d:\lms3\START_LMS.bat
```

This will:
1. ✅ Ask for your MySQL password
2. ✅ Configure the database connection
3. ✅ Create the database and tables
4. ✅ Start backend server (port 5000)
5. ✅ Start frontend server (port 3000)
6. ✅ Open http://localhost:3000 in your browser

**That's it!** The entire setup and startup is automated.

---

## 🔐 **MySQL Password**

When prompted for MySQL password:
- **If you have a password:** Enter it
- **If you DON'T have a password:** Just press Enter (leave it blank)

---

## 🎯 **Default Login Credentials**

Once the application opens:

### **Teacher Account:**
- Email: `teacher@example.com`
- Password: `password123`

### **Student Account:**
- Email: `student@example.com`
- Password: `password123`

---

## 📋 **Manual Startup (Alternative)**

If you prefer to start manually:

### **Terminal 1 - Backend:**
```powershell
cd d:\lms3\backend
npm start
```

### **Terminal 2 - Frontend:**
```powershell
cd d:\lms3\frontend
npm start
```

Then open: http://localhost:3000

---

## ✨ **Features to Test**

### **As a Teacher:**
1. ✅ Create assignments with due dates
2. ✅ View student submissions in real-time
3. ✅ Download submitted files
4. ✅ Grade assignments with feedback
5. ✅ See graded submissions immediately

### **As a Student:**
1. ✅ View all course assignments
2. ✅ Submit text responses
3. ✅ Upload files (PDF, DOC, DOCX, XLS, PPT, TXT, images, ZIP)
4. ✅ Submit both text and file together
5. ✅ See grades and feedback from teacher
6. ✅ Download submitted files

---

## 🐛 **Troubleshooting**

### **Problem: "Database setup failed"**
**Solution:**
1. Make sure MySQL is running
   - Check: Windows Services → MySQL94 should be "Running"
   - Start if needed: `net start MySQL94` (as Administrator)
2. Verify your password is correct
3. Run the setup script again

### **Problem: "Port already in use"**
**Solution:**
- Backend (5000): Stop other applications using port 5000
- Frontend (3000): Stop other React apps
- Or change ports in configuration

### **Problem: "Module not found"**
**Solution:**
```powershell
cd backend
npm install
cd ..\frontend
npm install
```

---

## 📁 **Project Structure**

```
d:\lms3\
├── backend\              # Express.js API server
│   ├── controllers\      # Business logic
│   ├── models\          # Database models (MySQL)
│   ├── routes\          # API routes
│   ├── middleware\      # Auth, upload, error handling
│   ├── uploads\         # Uploaded assignment files
│   └── server.js        # Main server file
│
├── frontend\            # React.js application
│   ├── src\
│   │   ├── components\  # React components
│   │   └── App.js      # Main app component
│   └── package.json
│
├── START_LMS.bat       # ⭐ ONE-CLICK SETUP & START
├── SETUP_AND_RUN.bat   # Alternative setup script
└── Documentation\
    ├── IMPLEMENTATION_COMPLETE.md
    ├── FILE_UPLOAD_FEATURE.md
    ├── TESTING_GUIDE.md
    └── README_ASSIGNMENT_FEATURE.md
```

---

## 🌐 **Application URLs**

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main application UI |
| **Backend API** | http://localhost:5000 | REST API server |
| **API Test** | http://localhost:5000/api/debug/courses | Test endpoint |

---

## 📚 **Complete Documentation**

- **IMPLEMENTATION_COMPLETE.md** - Full technical documentation
- **FILE_UPLOAD_FEATURE.md** - File upload feature guide
- **TESTING_GUIDE.md** - Testing procedures
- **WORKFLOW_DIAGRAM.md** - Visual workflows
- **README_ASSIGNMENT_FEATURE.md** - Feature overview

---

## ✅ **System Requirements**

- ✅ Node.js installed
- ✅ MySQL 9.4 installed and running
- ✅ Port 3000 available (frontend)
- ✅ Port 5000 available (backend)

---

## 🎉 **You're Ready!**

**Just double-click `START_LMS.bat` and you're good to go!**

The script handles everything automatically. In about 30 seconds, you'll have a fully functional Learning Management System running on your computer.

**Enjoy! 🚀**
