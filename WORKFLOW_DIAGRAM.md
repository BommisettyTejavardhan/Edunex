# 📊 Assignment Submission Feature - Workflow Diagrams

## 🎓 Complete User Workflow

### Teacher Workflow

```mermaid
graph TB
    A[Teacher Logs In] --> B[View Courses Dashboard]
    B --> C[Select Course]
    C --> D{Action?}
    
    D -->|Create Assignment| E[Fill Assignment Form]
    E --> F[Enter Title, Description, Due Date]
    F --> G[POST /api/assignments]
    G --> H[Assignment Created]
    H --> I[View Assignments List]
    
    D -->|View Submissions| J[Click on Assignment]
    J --> K[GET /api/submissions/assignment/:id]
    K --> L[Display All Submissions]
    L --> M{Submission Status?}
    
    M -->|Ungraded| N[Enter Grade 0-100]
    N --> O[Add Feedback Optional]
    O --> P[PUT /api/submissions/:id/grade]
    P --> Q[Submission Graded]
    Q --> R[Student Sees Grade Immediately]
    
    M -->|Already Graded| S[View Grade & Feedback]
    S --> T[Edit if Needed]
    T --> P
```

### Student Workflow

```mermaid
graph TB
    A[Student Logs In] --> B[View My Courses]
    B --> C[Select Enrolled Course]
    C --> D[View Assignments]
    D --> E{Assignment Status?}
    
    E -->|Not Submitted| F{Check Due Date}
    F -->|Before Due| G[Click Submit]
    G --> H[Write Response in Textarea]
    H --> I[POST /api/submissions]
    I --> J{Success?}
    
    J -->|Yes| K[Submission Saved]
    K --> L[Status: Submitted - Pending]
    L --> M[Wait for Teacher Grade]
    
    J -->|No - Duplicate| N[Error: Already Submitted]
    N --> O[View Previous Submission]
    
    F -->|After Due| P[Status: Overdue]
    P --> Q[Cannot Submit]
    
    E -->|Submitted| R{Graded?}
    R -->|Yes| S[View Grade & Feedback]
    S --> T[Grade: XX/100]
    
    R -->|No| U[Status: Pending Review]
    U --> V[View Submission Details]
```

---

## 🔄 Real-Time Visibility Flow

```mermaid
sequenceDiagram
    participant S as Student Browser
    participant SB as Backend Server
    participant DB as MySQL Database
    participant TB as Backend Server
    participant T as Teacher Browser

    Note over S,T: Student Submits Assignment
    
    S->>SB: POST /api/submissions<br/>{assignmentId, content}
    SB->>SB: Validate: Check for duplicates
    SB->>DB: INSERT INTO submissions<br/>(studentId, assignmentId, content, submittedAt)
    DB-->>SB: Submission created (id: 1)
    SB->>DB: SELECT submission with JOINs
    DB-->>SB: Return with student & assignment info
    SB-->>S: 201 Created<br/>{id, content, submittedAt, student, assignment}
    S->>S: Show success message
    S->>S: Update status badge

    Note over S,T: Teacher Views Submissions (Real-Time)
    
    T->>TB: GET /api/submissions/assignment/:id
    TB->>DB: SELECT * FROM submissions<br/>WHERE assignmentId = :id<br/>ORDER BY submittedAt DESC
    DB-->>TB: All submissions (including new one)
    TB-->>T: 200 OK<br/>[{submission1}, {submission2}, ...]
    T->>T: Display submissions instantly
    
    Note over T: Teacher sees student's submission<br/>IMMEDIATELY after it was created!
    
    Note over T,S: Teacher Grades Submission
    
    T->>TB: PUT /api/submissions/1/grade<br/>{grade: 95, feedback: "Great!"}
    TB->>TB: Validate: Teacher owns course
    TB->>DB: UPDATE submissions<br/>SET grade=95, feedback="Great!"<br/>WHERE id=1
    DB-->>TB: Updated successfully
    TB-->>T: 200 OK<br/>{grade: 95, feedback: "Great!"}
    T->>T: Update UI, show graded status
    
    Note over T,S: Student Checks Grade (Real-Time)
    
    S->>SB: GET /api/submissions/my
    SB->>DB: SELECT * FROM submissions<br/>WHERE studentId = :id
    DB-->>SB: All student submissions
    SB-->>S: 200 OK<br/>[{id, grade: 95, feedback, ...}]
    S->>S: Display grade badge
    S->>S: Show "Graded: 95/100"
    
    Note over S: Student sees grade<br/>IMMEDIATELY after teacher graded!
```

---

## 🗄️ Database Relations Flow

```mermaid
erDiagram
    USER ||--o{ COURSE : teaches
    USER ||--o{ ENROLLMENT : enrolls
    USER ||--o{ SUBMISSION : submits
    COURSE ||--o{ ENROLLMENT : has
    COURSE ||--o{ ASSIGNMENT : contains
    ASSIGNMENT ||--o{ SUBMISSION : receives
    
    USER {
        int id PK
        string name
        string email
        string password
        string role
    }
    
    COURSE {
        int id PK
        string title
        string description
        int teacherId FK
        date enrollmentDeadline
    }
    
    ASSIGNMENT {
        int id PK
        string title
        text description
        date dueDate
        int courseId FK
    }
    
    SUBMISSION {
        int id PK
        int assignmentId FK
        int studentId FK
        text content
        datetime submittedAt
        int grade
        text feedback
    }
    
    ENROLLMENT {
        int id PK
        int studentId FK
        int courseId FK
        datetime enrolledAt
    }
```

---

## 🔐 Authentication & Authorization Flow

```mermaid
graph TB
    A[User Request] --> B{Has JWT Token?}
    
    B -->|No| C[401 Unauthorized]
    C --> D[Redirect to Login]
    
    B -->|Yes| E[Decode JWT Token]
    E --> F{Valid Token?}
    
    F -->|No| C
    F -->|Yes| G[Extract User Info]
    G --> H[Set req.user]
    
    H --> I{Endpoint Type?}
    
    I -->|Create Assignment| J{Is Teacher?}
    J -->|No| K[403 Forbidden]
    J -->|Yes| L{Owns Course?}
    L -->|No| K
    L -->|Yes| M[Allow: Create Assignment]
    
    I -->|Grade Submission| N{Is Teacher?}
    N -->|No| K
    N -->|Yes| O{Owns Course?}
    O -->|No| K
    O -->|Yes| P[Allow: Grade Submission]
    
    I -->|Submit Assignment| Q{Is Student?}
    Q -->|No| K
    Q -->|Yes| R{Enrolled in Course?}
    R -->|No| K
    R -->|Yes| S{Already Submitted?}
    S -->|Yes| T[400 Duplicate]
    S -->|No| U[Allow: Submit Assignment]
    
    I -->|View My Submissions| V{Is Student?}
    V -->|No| K
    V -->|Yes| W[Filter by studentId]
    W --> X[Allow: View Own Submissions]
```

---

## 📱 Frontend Component Architecture

```mermaid
graph TB
    A[App.js] --> B[Router]
    
    B --> C[Login]
    B --> D{User Role?}
    
    D -->|Teacher| E[TeacherDashboard]
    E --> F[MyCourses]
    F --> G[CourseDetails]
    G --> H[Create Assignment Form]
    G --> I[Assignment List]
    I --> J[AssignmentSubmissions]
    J --> K[Submission Table]
    K --> L[Grade Form]
    
    D -->|Student| M[StudentDashboard]
    M --> N[MyCourses]
    N --> O[CourseDetails]
    O --> P[StudentAssignmentView]
    P --> Q[Assignment Cards]
    Q --> R[Status Badges]
    Q --> S[Submission Form]
    Q --> T[Grade Display]
    
    style J fill:#e1f5ff
    style P fill:#fff4e1
    
    classDef teacherComponent fill:#e1f5ff,stroke:#0066cc
    classDef studentComponent fill:#fff4e1,stroke:#ff9900
    
    class J,K,L teacherComponent
    class P,Q,R,S,T studentComponent
```

---

## 🎯 Status Badge Logic Flow

```mermaid
graph TB
    A[Assignment Data] --> B{Is Submitted?}
    
    B -->|No| C{Check Due Date}
    C -->|Past Due| D[RED Badge: Overdue]
    C -->|Before Due| E[YELLOW Badge: Not Submitted]
    
    B -->|Yes| F{Has Grade?}
    F -->|Yes| G[GREEN Badge: Graded XX/100]
    F -->|No| H[BLUE Badge: Submitted - Pending Review]
    
    style D fill:#ffebee,stroke:#c62828
    style E fill:#fff9c4,stroke:#f57c00
    style G fill:#e8f5e9,stroke:#2e7d32
    style H fill:#e3f2fd,stroke:#1565c0
```

---

## 🚀 Application Startup Flow

```mermaid
graph TB
    A[npm start backend] --> B[Load Environment Variables]
    B --> C[Connect to MySQL]
    C --> D{Connection Success?}
    
    D -->|No| E[Show Error Message]
    E --> F[Exit Process]
    
    D -->|Yes| G[Initialize Sequelize Models]
    G --> H[Sync Database Tables]
    H --> I[Setup Associations]
    I --> J{Sample Data Exists?}
    
    J -->|No| K[Create Sample Users]
    K --> L[Create Sample Courses]
    L --> M[Log: Data Initialized]
    
    J -->|Yes| N[Log: Data Already Exists]
    
    M --> O[Start Express Server]
    N --> O
    O --> P[Listen on Port 5000]
    P --> Q[Server Ready]
    
    R[npm start frontend] --> S[Start React Dev Server]
    S --> T[Listen on Port 3000]
    T --> U[Proxy API to :5000]
    U --> V[Frontend Ready]
    
    Q --> W[Full Stack Running]
    V --> W
    W --> X[Access: http://localhost:3000]
```

---

## 📊 Data Flow: Submission to Grade

```mermaid
graph LR
    A[Student Types Answer] --> B[Click Submit Button]
    B --> C[Frontend Validation]
    C --> D{Content Empty?}
    
    D -->|Yes| E[Show Error: Enter Content]
    D -->|No| F[POST /api/submissions]
    
    F --> G[Backend: Check Auth]
    G --> H[Backend: Check Duplicate]
    H --> I{Already Submitted?}
    
    I -->|Yes| J[400: Already Submitted]
    I -->|No| K[Create Submission Record]
    
    K --> L[Set submittedAt = NOW]
    L --> M[Save to MySQL]
    M --> N[Return Submission + Details]
    N --> O[Frontend: Update UI]
    O --> P[Show Success Message]
    P --> Q[Change Badge to: Submitted]
    
    R[Teacher Opens Assignment] --> S[GET /api/submissions/assignment/:id]
    S --> T[Fetch All Submissions]
    T --> U[Include Student Info]
    U --> V[Order by submittedAt DESC]
    V --> W[Display in Table]
    
    W --> X[Teacher Enters Grade]
    X --> Y[Teacher Enters Feedback]
    Y --> Z[Click Submit Grade]
    Z --> AA[PUT /api/submissions/:id/grade]
    AA --> AB[Backend: Verify Teacher Owns Course]
    AB --> AC[Update Submission Record]
    AC --> AD[Return Updated Submission]
    AD --> AE[Frontend: Update UI]
    AE --> AF[Show: Graded Badge]
    
    AG[Student Refreshes Page] --> AH[GET /api/submissions/my]
    AH --> AI[Fetch Student Submissions]
    AI --> AJ[Include Grades & Feedback]
    AJ --> AK[Display with Green Badge]
    AK --> AL[Student Sees Grade: XX/100]
```

---

## 🎨 UI State Management

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> DisplayAssignments: Data Fetched
    
    DisplayAssignments --> NotSubmitted: No Submission Found
    DisplayAssignments --> Submitted: Submission Exists
    
    NotSubmitted --> CheckDueDate
    CheckDueDate --> Overdue: Past Due Date
    CheckDueDate --> Available: Before Due Date
    
    Available --> Submitting: Student Clicks Submit
    Submitting --> Submitted: Success
    Submitting --> Error: Failure
    Error --> Available: User Retries
    
    Submitted --> CheckGrade
    CheckGrade --> Pending: No Grade Yet
    CheckGrade --> Graded: Grade Exists
    
    Pending --> Graded: Teacher Grades
    
    Overdue --> [*]
    Graded --> [*]
```

---

## 🔄 Component Lifecycle

### StudentAssignmentView Component

```mermaid
graph TB
    A[Component Mounts] --> B[useEffect Triggered]
    B --> C[fetchAssignments]
    C --> D[Fetch Course Details]
    C --> E[Fetch Course Assignments]
    C --> F[Fetch My Submissions]
    
    D --> G[Set Course State]
    E --> H[Set Assignments State]
    F --> I[Match Submissions to Assignments]
    I --> J[Mark isSubmitted Flag]
    J --> K[Set Loading = false]
    K --> L[Render Component]
    
    L --> M{User Action?}
    
    M -->|Types in Textarea| N[Update submissionContent State]
    N --> L
    
    M -->|Clicks Submit| O[handleSubmit]
    O --> P[Set Submitting State]
    P --> Q[POST /api/submissions]
    Q --> R{Success?}
    
    R -->|Yes| S[Clear Textarea]
    S --> T[Show Success Alert]
    T --> U[Call fetchAssignments Again]
    U --> C
    
    R -->|No| V[Show Error Alert]
    V --> W[Clear Submitting State]
    W --> L
```

### AssignmentSubmissions Component

```mermaid
graph TB
    A[Component Mounts] --> B[useEffect Triggered]
    B --> C[fetchAssignmentData]
    C --> D[GET /api/submissions/assignment/:id]
    D --> E[Set Submissions State]
    E --> F[Extract Assignment from First Submission]
    F --> G[Set Loading = false]
    G --> H[Render Component]
    
    H --> I{User Action?}
    
    I -->|Enters Grade| J[Update Grading State]
    J --> H
    
    I -->|Enters Feedback| K[Update Feedback State]
    K --> H
    
    I -->|Clicks Submit Grade| L[handleGradeSubmission]
    L --> M[PUT /api/submissions/:id/grade]
    M --> N{Success?}
    
    N -->|Yes| O[Update Submission in List]
    O --> P[Clear Grading State]
    P --> Q[Show Success Alert]
    Q --> H
    
    N -->|No| R[Show Error Alert]
    R --> H
```

---

## 📈 Performance Optimization

```mermaid
graph TB
    A[Performance Strategies] --> B[Database Level]
    A --> C[Backend Level]
    A --> D[Frontend Level]
    
    B --> E[Indexed Columns]
    E --> F[assignmentId Index]
    E --> G[studentId Index]
    E --> H[submittedAt Index]
    
    B --> I[Unique Constraints]
    I --> J[assignmentId + studentId]
    
    C --> K[Efficient Queries]
    K --> L[Use JOINs Instead of Multiple Queries]
    K --> M[Select Only Needed Attributes]
    K --> N[Order by Index Columns]
    
    C --> O[Error Handling]
    O --> P[asyncHandler Wrapper]
    O --> Q[Global Error Middleware]
    
    D --> R[State Management]
    R --> S[useState for Local State]
    R --> T[Minimize Re-renders]
    
    D --> U[Loading States]
    U --> V[Show Spinners During Fetch]
    U --> W[Disable Buttons During Submit]
    
    D --> X[Animations]
    X --> Y[Framer Motion for Smooth UX]
    X --> Z[Stagger Child Animations]
```

---

These diagrams provide a complete visual overview of the assignment submission feature architecture and workflows!
