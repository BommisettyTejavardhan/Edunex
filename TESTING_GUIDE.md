# 🧪 Assignment Submission Feature - Complete Testing Guide

## 📋 Pre-Testing Checklist

- [ ] MySQL service is running (MySQL94)
- [ ] MySQL password configured in `backend/.env`
- [ ] Database setup complete (`node setup-database.js`)
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Browser open to http://localhost:3000

---

## 🎯 Manual Testing Workflow

### Test 1: Teacher Creates Assignment

**Objective:** Verify teachers can create assignments for their courses

**Steps:**
1. Open http://localhost:3000
2. Click "Login"
3. Enter credentials:
   - Email: `teacher@example.com`
   - Password: `password123`
4. Click "Sign In"
5. Navigate to "My Courses"
6. Select "Introduction to React" course
7. Click "Create Assignment" button
8. Fill in the form:
   - **Title:** "React Hooks Assignment"
   - **Description:** "Create a counter app using useState and useEffect hooks"
   - **Due Date:** Select a date 7 days in the future
9. Click "Create Assignment"

**Expected Results:**
- ✅ Form validation passes
- ✅ Assignment is created successfully
- ✅ Success message appears
- ✅ New assignment appears in the list
- ✅ Assignment shows: title, description, due date
- ✅ "0 submissions" badge displayed

**API Call:**
```http
POST /api/assignments
{
  "title": "React Hooks Assignment",
  "description": "Create a counter app...",
  "courseId": 1,
  "dueDate": "2025-10-24T23:59:59"
}

Expected Response: 201 Created
```

---

### Test 2: Student Views Assignments

**Objective:** Verify students can see assignments for enrolled courses

**Steps:**
1. Logout from teacher account
2. Login as student:
   - Email: `student@example.com`
   - Password: `password123`
3. Navigate to "My Courses"
4. Click "Enroll in Course" if not already enrolled
5. Select "Introduction to React"
6. View assignments list

**Expected Results:**
- ✅ All course assignments displayed
- ✅ Assignment cards show: title, description, due date
- ✅ Status badge shows "Not Submitted" (yellow)
- ✅ Submission form with textarea is visible
- ✅ "Submit Assignment" button is enabled

**API Calls:**
```http
GET /api/assignments/course/1
GET /api/submissions/my

Expected Response: 200 OK with assignments array
```

---

### Test 3: Student Submits Assignment

**Objective:** Verify students can submit assignments with real-time visibility

**Steps:**
1. As student, find "React Hooks Assignment"
2. In the textarea, type:
   ```
   I created a counter app using useState to manage count state and 
   useEffect to log changes. The app has increment and decrement buttons.
   ```
3. Click "Submit Assignment" button

**Expected Results:**
- ✅ Button shows "Submitting..." during submission
- ✅ Success alert appears: "✅ Assignment submitted successfully!"
- ✅ Textarea is cleared
- ✅ Status badge changes to "Submitted - Pending Review" (blue)
- ✅ Submission form is hidden/disabled
- ✅ Submission timestamp is displayed
- ✅ Submitted content is visible

**API Call:**
```http
POST /api/submissions
{
  "assignmentId": 1,
  "content": "I created a counter app..."
}

Expected Response: 201 Created
{
  "id": 1,
  "assignmentId": 1,
  "studentId": 2,
  "content": "I created a counter app...",
  "submittedAt": "2025-10-17T15:30:00.000Z",
  "student": {
    "id": 2,
    "name": "John Student",
    "email": "student@example.com"
  }
}
```

---

### Test 4: Duplicate Submission Prevention

**Objective:** Verify students cannot submit the same assignment twice

**Steps:**
1. As student, try to submit the same assignment again
2. (The form should be hidden, but test via API if needed)

**Expected Results:**
- ✅ Submission form is not visible after first submission
- ✅ If attempted via API: Error "Assignment already submitted"
- ✅ Status remains "Submitted - Pending Review"

**API Call:**
```http
POST /api/submissions (duplicate)
{
  "assignmentId": 1,
  "content": "Another attempt..."
}

Expected Response: 400 Bad Request
{
  "message": "Assignment already submitted"
}
```

---

### Test 5: Real-Time Teacher Visibility

**Objective:** Verify teacher sees submission immediately without refresh

**Steps:**
1. Keep student page open (showing submitted assignment)
2. Open a NEW browser window/tab
3. Login as teacher (teacher@example.com / password123)
4. Navigate to "My Courses"
5. Select "Introduction to React"
6. Click on "React Hooks Assignment"

**Expected Results:**
- ✅ Teacher sees submission immediately
- ✅ No page refresh required
- ✅ Submission appears in submissions table
- ✅ Student name displayed: "John Student"
- ✅ Student email displayed: "student@example.com"
- ✅ Submission timestamp displayed
- ✅ Submission content is readable
- ✅ Status shows "Pending" (yellow badge)
- ✅ "1 submissions" badge on assignment list

**API Call:**
```http
GET /api/submissions/assignment/1

Expected Response: 200 OK
[
  {
    "id": 1,
    "content": "I created a counter app...",
    "submittedAt": "2025-10-17T15:30:00.000Z",
    "grade": null,
    "feedback": null,
    "student": {
      "id": 2,
      "name": "John Student",
      "email": "student@example.com"
    }
  }
]
```

**Timing Test:**
- Record time when student clicks "Submit Assignment"
- Record time when teacher sees the submission
- **Expected:** Delay should be < 2 seconds (near-instant)

---

### Test 6: Teacher Grades Submission

**Objective:** Verify teacher can grade submissions with scores and feedback

**Steps:**
1. As teacher, on the submissions page
2. Find the submission from "John Student"
3. In the "Grade" column:
   - Enter grade: `95`
4. In the "Feedback" textarea:
   - Enter: `Excellent work! Your implementation of useState and useEffect is correct. Good code structure.`
5. Click "Submit Grade" button

**Expected Results:**
- ✅ Grade input accepts numbers 0-100
- ✅ Grade validation prevents values > 100 or < 0
- ✅ Feedback is optional (can be empty)
- ✅ Success alert: "✅ Submission graded successfully!"
- ✅ Status badge changes to "Graded" (green)
- ✅ Grade displays: "95/100"
- ✅ Feedback is visible in the table
- ✅ Grading inputs are cleared

**API Call:**
```http
PUT /api/submissions/1/grade
{
  "grade": 95,
  "feedback": "Excellent work! Your implementation..."
}

Expected Response: 200 OK
{
  "id": 1,
  "grade": 95,
  "feedback": "Excellent work! Your implementation...",
  "student": {
    "id": 2,
    "name": "John Student",
    "email": "student@example.com"
  }
}
```

---

### Test 7: Real-Time Student Grade Visibility

**Objective:** Verify student sees grade immediately after teacher grades

**Steps:**
1. Switch to student browser window
2. Refresh the page (or navigate away and back)
3. View "React Hooks Assignment"

**Expected Results:**
- ✅ Status badge shows "Graded: 95/100" (green)
- ✅ Grade is displayed prominently
- ✅ Feedback is visible
- ✅ Submission timestamp still shown
- ✅ Submission content still visible

**API Call:**
```http
GET /api/submissions/my

Expected Response: 200 OK
[
  {
    "id": 1,
    "content": "I created a counter app...",
    "submittedAt": "2025-10-17T15:30:00.000Z",
    "grade": 95,
    "feedback": "Excellent work! Your implementation...",
    "assignment": {
      "id": 1,
      "title": "React Hooks Assignment",
      "dueDate": "2025-10-24T23:59:59.000Z"
    }
  }
]
```

---

### Test 8: Overdue Assignment Indicator

**Objective:** Verify overdue assignments show correct status

**Steps:**
1. As teacher, create a new assignment with past due date:
   - Title: "Past Due Assignment"
   - Due Date: Yesterday's date
2. As student, view the assignment

**Expected Results:**
- ✅ Status badge shows "Overdue" (red)
- ✅ Student cannot submit (or submission is allowed with overdue warning)
- ✅ Visual indication that assignment is past due date

---

### Test 9: Multiple Submissions Handling

**Objective:** Verify teacher can handle multiple student submissions

**Steps:**
1. Create another student account (or use existing)
2. Enroll in the course
3. Submit the assignment with different content
4. As teacher, view all submissions

**Expected Results:**
- ✅ All submissions displayed in table
- ✅ Submissions ordered by newest first
- ✅ Each submission shows correct student info
- ✅ Each submission has independent grading inputs
- ✅ Grading one submission doesn't affect others

---

### Test 10: Authorization & Security

**Objective:** Verify proper access control

**Test 10.1: Student Cannot Grade Submissions**
```http
PUT /api/submissions/1/grade
Authorization: Bearer <student_token>

Expected Response: 401 Unauthorized or 403 Forbidden
```

**Test 10.2: Teacher Cannot Submit Assignments**
```http
POST /api/submissions
Authorization: Bearer <teacher_token>

Expected: Either 403 Forbidden or logical prevention in UI
```

**Test 10.3: Teacher Can Only Grade Own Course Submissions**
1. Create another teacher account
2. Try to grade submission from another teacher's course
3. Expected: 401 Unauthorized "Not authorized to grade this submission"

---

## 🤖 Automated Testing

### Run the Test Script

```bash
# From project root
node test-assignment-submission.js
```

**What it tests:**
1. ✅ Teacher login and authentication
2. ✅ Course creation
3. ✅ Assignment creation
4. ✅ Student enrollment
5. ✅ Assignment submission
6. ✅ Real-time visibility (teacher fetches immediately)
7. ✅ Grading functionality
8. ✅ Student grade visibility
9. ✅ Duplicate submission prevention
10. ✅ Data integrity

**Expected Output:**
```
🧪 Assignment Submission Feature - Comprehensive Test

📝 Test 1: Teacher Login
✅ Teacher logged in successfully

📝 Test 2: Create Assignment
✅ Assignment created successfully
   ID: 1
   Title: Test Assignment

📝 Test 3: Student Login
✅ Student logged in successfully

📝 Test 4: Student Submits Assignment
✅ Assignment submitted successfully
   Submission ID: 1
   Submitted at: 2025-10-17T15:30:00.000Z

📝 Test 5: Real-Time Visibility
✅ Teacher sees submission immediately
   Submissions count: 1

📝 Test 6: Grade Submission
✅ Submission graded successfully
   Grade: 95/100

📝 Test 7: Student Sees Grade
✅ Student can see grade
   Grade: 95

📝 Test 8: Duplicate Prevention
✅ Duplicate submission prevented correctly

✅ ALL TESTS PASSED!
```

---

## 🔍 Manual API Testing (Postman/Insomnia)

### Setup
1. Install Postman or Insomnia
2. Create a new collection "LMS Assignment Submission"
3. Set base URL: `http://localhost:5000`

### Test Collection

#### 1. Teacher Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "teacher@example.com",
  "password": "password123"
}

Save the token from response!
```

#### 2. Create Assignment
```http
POST http://localhost:5000/api/assignments
Authorization: Bearer <TEACHER_TOKEN>
Content-Type: application/json

{
  "title": "API Test Assignment",
  "description": "Testing via API",
  "courseId": 1,
  "dueDate": "2025-10-25T23:59:59"
}

Save assignment ID!
```

#### 3. Student Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}

Save the token from response!
```

#### 4. Get Course Assignments
```http
GET http://localhost:5000/api/assignments/course/1
Authorization: Bearer <STUDENT_TOKEN>
```

#### 5. Submit Assignment
```http
POST http://localhost:5000/api/submissions
Authorization: Bearer <STUDENT_TOKEN>
Content-Type: application/json

{
  "assignmentId": 1,
  "content": "This is my submission via API testing"
}

Save submission ID!
```

#### 6. Get Assignment Submissions (Teacher)
```http
GET http://localhost:5000/api/submissions/assignment/1
Authorization: Bearer <TEACHER_TOKEN>
```

#### 7. Grade Submission
```http
PUT http://localhost:5000/api/submissions/1/grade
Authorization: Bearer <TEACHER_TOKEN>
Content-Type: application/json

{
  "grade": 88,
  "feedback": "Good work, but needs improvement in error handling"
}
```

#### 8. Get My Submissions (Student)
```http
GET http://localhost:5000/api/submissions/my
Authorization: Bearer <STUDENT_TOKEN>
```

---

## 📊 Test Results Template

### Manual Testing Checklist

| Test Case | Status | Notes | Timestamp |
|-----------|--------|-------|-----------|
| Teacher creates assignment | ⬜ | | |
| Student views assignments | ⬜ | | |
| Student submits assignment | ⬜ | | |
| Duplicate prevention works | ⬜ | | |
| Teacher sees submission (real-time) | ⬜ | | |
| Teacher grades submission | ⬜ | | |
| Student sees grade (real-time) | ⬜ | | |
| Overdue indicator works | ⬜ | | |
| Multiple submissions handled | ⬜ | | |
| Authorization enforced | ⬜ | | |

### Performance Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Submission to DB persistence | < 500ms | | |
| Teacher sees submission | < 2s | | |
| Grade to student visibility | < 2s | | |
| Page load time | < 1s | | |
| API response time | < 300ms | | |

---

## 🐛 Common Issues & Solutions

### Issue 1: "Assignment already submitted"
**Cause:** Student trying to submit same assignment twice
**Solution:** Expected behavior - duplicate prevention working correctly

### Issue 2: "Not authorized to grade this submission"
**Cause:** Teacher trying to grade another teacher's course assignment
**Solution:** Expected behavior - role-based access control working

### Issue 3: Submissions not appearing
**Cause:** Wrong assignmentId or database not synced
**Solution:** 
1. Check assignmentId matches
2. Verify MySQL is running
3. Check backend logs for errors

### Issue 4: Real-time visibility delayed
**Cause:** Browser caching or network latency
**Solution:**
1. Hard refresh (Ctrl+Shift+R)
2. Check network tab for API calls
3. Verify backend is returning fresh data

---

## ✅ Test Completion Criteria

**Feature is considered fully tested when:**
- [x] All manual tests pass
- [x] Automated test script passes
- [x] API tests via Postman pass
- [x] Real-time visibility verified (< 2s delay)
- [x] Duplicate prevention verified
- [x] Authorization checks pass
- [x] Grade validation works (0-100)
- [x] Status badges display correctly
- [x] Error handling works properly
- [x] No console errors in browser
- [x] No errors in backend logs

---

## 📝 Test Report Template

```
Assignment Submission Feature Test Report
Date: _______________
Tester: _______________
Environment: Local Development

Summary:
- Total Tests: 10
- Passed: ___
- Failed: ___
- Skipped: ___

Critical Issues:
1. _______________
2. _______________

Minor Issues:
1. _______________
2. _______________

Overall Status: [ ] PASS [ ] FAIL

Notes:
_____________________________________
_____________________________________
```

---

**Ready to test!** Follow these steps systematically to verify the complete assignment submission feature. 🚀
