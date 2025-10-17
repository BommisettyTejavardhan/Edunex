# 📎 File Upload Feature for Assignment Submissions

## Overview

The assignment submission system now supports **file uploads** in addition to text submissions. Students can upload files (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, images, ZIP) along with or instead of text responses.

---

## ✅ Features Implemented

### For Students:
- ✅ Upload files up to 10MB
- ✅ Support for multiple file types (PDF, Office documents, images, ZIP)
- ✅ Submit text, file, or both together
- ✅ View and download their submitted files
- ✅ Visual file upload interface with drag-and-drop support

### For Teachers:
- ✅ View submitted files in the submissions table
- ✅ Download student-submitted files
- ✅ See file names and types
- ✅ Grade submissions with files just like text submissions

### System Features:
- ✅ Secure file storage in server uploads directory
- ✅ Unique filename generation (prevents overwrites)
- ✅ File type validation
- ✅ File size limits (10MB max)
- ✅ Download authorization (only student who submitted or course teacher)

---

## 🏗️ Implementation Details

### Backend Components

#### 1. **File Upload Middleware** (`backend/middleware/upload.js`)

```javascript
// Configured with multer for file handling
- Storage: Disk storage in `uploads/assignments/`
- Filename format: {studentId}_{timestamp}_{random}_{originalname}
- Allowed types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF, ZIP
- Size limit: 10MB
- Automatic directory creation
```

#### 2. **Submission Controller Updates** (`backend/controllers/submissionController.js`)

**New Endpoints:**

##### a. Submit Assignment with File
```javascript
POST /api/submissions/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- assignmentId: <number>
- content: <string> (optional)
- file: <file> (optional)

Response: 201 Created
{
  "id": 1,
  "assignmentId": 1,
  "studentId": 2,
  "content": "My text submission",
  "fileUrl": "/uploads/assignments/2_1234567890_myfile.pdf",
  "submittedAt": "2025-10-17T10:30:00.000Z",
  ...
}
```

##### b. Download Submission File
```javascript
GET /api/submissions/:id/download
Authorization: Bearer <token>

Authorization:
- Student who submitted the assignment
- Teacher who owns the course

Response: File download
```

#### 3. **Static File Serving** (`backend/server.js`)

```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

Files are accessible at: `http://localhost:5000/uploads/assignments/filename`

---

### Frontend Components

#### 1. **StudentAssignmentView Component**

**Updated Features:**
- File input with drag-and-drop interface
- File selection state management
- Visual indicator of selected file
- Support for both text and file submission
- Download link for submitted files

**Submission Logic:**
```javascript
// If file is selected, use multipart/form-data
if (file) {
  const formData = new FormData();
  formData.append('assignmentId', assignmentId);
  formData.append('content', content || '');
  formData.append('file', file);
  
  fetch('/api/submissions/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
}
```

#### 2. **AssignmentSubmissions Component**

**Updated Features:**
- Display submitted file links
- "View File" button for file downloads
- Show both text and file if both were submitted
- Graceful handling when no submission exists

---

## 🎨 User Interface

### Student Submission Form

```
┌──────────────────────────────────────────────┐
│ Submit Your Work                             │
├──────────────────────────────────────────────┤
│                                              │
│ Text Response (Optional)                     │
│ ┌──────────────────────────────────────────┐ │
│ │ Type your assignment submission here...   │ │
│ │                                           │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Upload File (Optional)                       │
│ ┌──────────────────────────────────────────┐ │
│ │  📁 Click to upload or drag and drop     │ │
│ │  PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX,   │ │
│ │  TXT, JPG, PNG, ZIP (MAX. 10MB)          │ │
│ │  Selected: assignment.pdf                 │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ⚠️ You can submit text, a file, or both.    │
│    At least one is required.                 │
│                                              │
│ [ 🚀 Submit Assignment ]                     │
└──────────────────────────────────────────────┘
```

### Student Submitted View

```
┌──────────────────────────────────────────────┐
│ ✅ Your Submission                           │
├──────────────────────────────────────────────┤
│ My text response to the assignment...        │
│                                              │
│ [ 📥 Download Submitted File ]               │
│                                              │
│ Submitted on: October 17, 2025, 10:30 AM    │
└──────────────────────────────────────────────┘
```

### Teacher View (Submissions Table)

```
┌─────────────┬──────────────────────┬────────────┬───────────┬──────────┐
│ Student     │ Submission           │ Status     │ Grade     │ Actions  │
├─────────────┼──────────────────────┼────────────┼───────────┼──────────┤
│ John Doe    │ My text response...  │ Graded     │ 95/100    │ ✅ Graded│
│ john@...    │ [📎 View File]       │            │           │          │
│ Submitted:  │                      │            │           │          │
│ 10/17 10:30 │                      │            │           │          │
└─────────────┴──────────────────────┴────────────┴───────────┴──────────┘
```

---

## 📂 File Storage Structure

```
backend/
└── uploads/
    └── assignments/
        ├── 2_1697545800000_123456789_assignment.pdf
        ├── 3_1697545900000_987654321_homework.docx
        ├── 2_1697546000000_456789123_project.zip
        └── ...
```

**Filename Format:**
```
{studentId}_{timestamp}_{random}_{sanitized_originalname}.{ext}

Example:
2_1697545800000_123456789_assignment.pdf
│ │            │         └── Original filename (sanitized)
│ │            └── Random number (uniqueness)
│ └── Unix timestamp (uniqueness)
└── Student ID (organization)
```

---

## 🔒 Security Features

### 1. **File Type Validation**
- Server-side MIME type checking
- Only allowed file types are accepted
- Rejects dangerous file types (exe, bat, sh, etc.)

### 2. **File Size Limits**
- Maximum 10MB per file
- Prevents server storage abuse
- Configurable in middleware

### 3. **Access Control**
- Download endpoint requires authentication
- Students can only download their own submissions
- Teachers can only download submissions from their courses
- Authorization checked before file access

### 4. **Filename Sanitization**
- Special characters removed
- Path traversal prevention
- Unique names prevent overwrites

---

## 🔧 Configuration

### Allowed File Types

```javascript
// backend/middleware/upload.js
const allowedTypes = [
  'application/pdf',                    // PDF
  'application/msword',                 // DOC
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/vnd.ms-excel',           // XLS
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'application/vnd.ms-powerpoint',      // PPT
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
  'text/plain',                         // TXT
  'image/jpeg',                         // JPG
  'image/png',                          // PNG
  'image/gif',                          // GIF
  'application/zip',                    // ZIP
  'application/x-zip-compressed'        // ZIP (alternative)
];
```

### File Size Limit

```javascript
// backend/middleware/upload.js
limits: {
  fileSize: 10 * 1024 * 1024 // 10MB (configurable)
}
```

### Upload Directory

```javascript
// backend/middleware/upload.js
const uploadDir = path.join(__dirname, '../uploads/assignments');
```

---

## 🧪 Testing the Feature

### Manual Testing Steps

#### **Test 1: Text-Only Submission**
1. Login as student
2. Select an assignment
3. Enter text in the textarea
4. Click "Submit Assignment" (without uploading file)
5. ✅ Verify submission is saved with text only

#### **Test 2: File-Only Submission**
1. Login as student
2. Select an assignment
3. Upload a file (leave text empty)
4. Click "Submit Assignment"
5. ✅ Verify submission is saved with file only

#### **Test 3: Text + File Submission**
1. Login as student
2. Select an assignment
3. Enter text AND upload a file
4. Click "Submit Assignment"
5. ✅ Verify both text and file are saved

#### **Test 4: File Type Validation**
1. Try uploading an invalid file type (e.g., .exe)
2. ✅ Should show error message

#### **Test 5: File Size Validation**
1. Try uploading a file > 10MB
2. ✅ Should show error message

#### **Test 6: Download File (Student)**
1. Submit assignment with file
2. Click "Download Submitted File" link
3. ✅ File should download

#### **Test 7: Download File (Teacher)**
1. Login as teacher
2. View assignment submissions
3. Click "View File" link
4. ✅ File should open/download

#### **Test 8: Authorization Check**
1. Try accessing download URL without auth token
2. ✅ Should return 401 Unauthorized

---

## 📊 Database Updates

The `fileUrl` field already exists in the Submission model:

```javascript
// backend/models/mysql/Submission.js
fileUrl: {
  type: DataTypes.STRING(500),
  allowNull: true  // Optional - can submit text only
}
```

**No database migration required!** The field was already present.

---

## 🌐 API Endpoints Summary

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/api/submissions` | Submit text-only | Student |
| POST | `/api/submissions/upload` | Submit with file | Student |
| GET | `/api/submissions/my` | Get student's submissions | Student |
| GET | `/api/submissions/assignment/:id` | Get assignment submissions | Teacher |
| GET | `/api/submissions/:id/download` | Download file | Student/Teacher |
| PUT | `/api/submissions/:id/grade` | Grade submission | Teacher |

---

## 🚀 How to Use

### For Students:

1. **Navigate to assignment:**
   - Login → My Courses → Select Course → View Assignments

2. **Submit your work:**
   - **Option A:** Write text response only
   - **Option B:** Upload file only
   - **Option C:** Both text and file
   - Click "Submit Assignment"

3. **View your submission:**
   - See submitted text
   - Click "Download Submitted File" to get your file

### For Teachers:

1. **View submissions:**
   - Login → My Courses → Select Course → Click Assignment

2. **Review student work:**
   - Read text submissions
   - Click "View File" to download/open files

3. **Grade:**
   - Enter grade (0-100)
   - Add feedback (optional)
   - Click "Grade"

---

## 🔄 Workflow Diagram

```
Student Submits Assignment
         │
         ├─── Has File?
         │    ├─── Yes: FormData → POST /api/submissions/upload
         │    └─── No:  JSON → POST /api/submissions
         │
         ↓
    File saved to:
    /uploads/assignments/{unique_filename}
         │
         ↓
    Database record created with:
    - content (text)
    - fileUrl (path to file)
         │
         ↓
    Teacher views submissions
         │
         ↓
    Teacher clicks "View File"
         │
         ↓
    Authorization check:
    - Is teacher of this course?
         │
         ↓
    File downloaded via:
    GET /api/submissions/:id/download
```

---

## ⚠️ Important Notes

1. **File Storage:** Files are stored locally in `backend/uploads/assignments/`
   - For production, consider cloud storage (AWS S3, Google Cloud Storage)
   - Backup uploads directory regularly

2. **File Size:** 10MB limit is configurable
   - Adjust in `backend/middleware/upload.js`
   - Consider server storage capacity

3. **File Types:** Only specific types allowed
   - Add more types in middleware if needed
   - Always validate MIME types server-side

4. **Security:** 
   - Never trust client-side validation alone
   - Always check authorization before file access
   - Sanitize filenames to prevent path traversal

5. **Performance:**
   - Large files may slow down uploads
   - Consider implementing chunked uploads for very large files
   - Monitor server disk space

---

## 🎉 Summary

The file upload feature is **fully implemented and functional**! Students can now:
- ✅ Upload assignment files
- ✅ Submit text, files, or both
- ✅ Download their submitted files
- ✅ See submission confirmations

Teachers can:
- ✅ View submitted files
- ✅ Download student files
- ✅ Grade submissions with files

The system is secure, validated, and ready to use! 🚀
