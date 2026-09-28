# School Management System

A backend REST API for managing school operations using in-memory data.

---

## Authentication

All protected endpoints require an Authorization header with Bearer token format:
`Authorization: Bearer <your_token>`

Rate limit: 20 requests per 15 minutes on register and login routes.

### 1. Register Admin
* **Method**: POST
* **Endpoint**: `/api/auth/register`
* **Authorization**: None
* **Body**:
```json
{
  "firstName": "Admin",
  "surname": "User",
  "email": "admin@example.com",
  "password": "Password123!",
  "role": "admin"
}
```

### 2. Register Teacher
* **Method**: POST
* **Endpoint**: `/api/auth/register`
* **Authorization**: None
* **Body**:
```json
{
  "firstName": "Jane",
  "surname": "Smith",
  "email": "jane@example.com",
  "password": "Password123!",
  "role": "teacher"
}
```
* **Notes**: Creates a login account. To access protected teacher endpoints (such as viewing students or results), an Admin must also create the teacher's profile via `POST /api/teachers` with a matching email.

### 3. Register Student
* **Method**: POST
* **Endpoint**: `/api/auth/register`
* **Authorization**: None
* **Body**:
```json
{
  "firstName": "David",
  "surname": "Okafor",
  "email": "david@example.com",
  "password": "Password123!",
  "role": "student"
}
```

### 4. Login
* **Method**: POST
* **Endpoint**: `/api/auth/login`
* **Authorization**: None
* **Body**:
```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```
* **Notes**: Returns a JWT token valid for 1 hour. Copy this token for subsequent requests.

---

## Students

### 5. Create Student
* **Method**: POST
* **Endpoint**: `/api/students`
* **Authorization**: Admin
* **Body**:
```json
{
  "name": "David Okafor",
  "email": "david@example.com",
  "phone": "08012345678",
  "class": 1,
  "userId": 3
}
```
* **Notes**: `class` (or `classId`) is optional and must reference an existing class. `userId` is optional and links to the registered student user (auto-linked by email if omitted).

### 6. Get Students
* **Method**: GET
* **Endpoint**: `/api/students`
* **Authorization**: Admin or Teacher
* **Body**: None

### 7. Get Student
* **Method**: GET
* **Endpoint**: `/api/students/:id`
* **Authorization**: Admin or Teacher
* **Body**: None

### 8. Update Student
* **Method**: PUT
* **Endpoint**: `/api/students/:id`
* **Authorization**: Admin
* **Body**:
```json
{
  "name": "David O. Okafor",
  "phone": "09087654321"
}
```
* **Notes**: All fields are optional.

### 9. Delete Student
* **Method**: DELETE
* **Endpoint**: `/api/students/:id`
* **Authorization**: Admin
* **Body**: None
* **Notes**: Cannot delete a student if existing results reference this student.

### 10. Get Student Profile
* **Method**: GET
* **Endpoint**: `/api/students/profile`
* **Authorization**: Student
* **Body**: None
* **Notes**: Returns the authenticated student's profile without needing their database ID. Students cannot view other students' profiles.

---

## Teachers

### 11. Create Teacher
* **Method**: POST
* **Endpoint**: `/api/teachers`
* **Authorization**: Admin
* **Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "08098765432",
  "subject": 1,
  "userId": 2
}
```
* **Notes**: `subject` (or `subjectId`) is optional and must reference an existing subject. `userId` is optional and links to the registered teacher user (auto-linked by email if omitted). A teacher cannot access teacher-restricted endpoints until this profile has been created by an Admin.

### 12. Get Teachers
* **Method**: GET
* **Endpoint**: `/api/teachers`
* **Authorization**: Admin or Teacher
* **Body**: None

### 13. Get Teacher
* **Method**: GET
* **Endpoint**: `/api/teachers/:id`
* **Authorization**: Admin or Teacher
* **Body**: None

### 14. Update Teacher
* **Method**: PUT
* **Endpoint**: `/api/teachers/:id`
* **Authorization**: Admin
* **Body**:
```json
{
  "phone": "07011111111"
}
```

### 15. Delete Teacher
* **Method**: DELETE
* **Endpoint**: `/api/teachers/:id`
* **Authorization**: Admin
* **Body**: None
* **Notes**: Cannot delete a teacher who is currently assigned to a class.

---

## Classes

### 16. Create Class
* **Method**: POST
* **Endpoint**: `/api/classes`
* **Authorization**: Admin
* **Body**:
```json
{
  "name": "JSS 1",
  "teacherId": 1
}
```
* **Notes**: `teacherId` is optional and must reference an existing teacher.

### 17. Get Classes
* **Method**: GET
* **Endpoint**: `/api/classes`
* **Authorization**: Admin, Teacher, or Student
* **Body**: None
* **Notes**: Students only see the class they are assigned to.

### 18. Get Class
* **Method**: GET
* **Endpoint**: `/api/classes/:id`
* **Authorization**: Admin, Teacher, or Student
* **Body**: None
* **Notes**: Students can only access their own assigned class; accessing another class returns 403 Forbidden.

### 19. Update Class
* **Method**: PUT
* **Endpoint**: `/api/classes/:id`
* **Authorization**: Admin
* **Body**:
```json
{
  "name": "JSS 2"
}
```

### 20. Delete Class
* **Method**: DELETE
* **Endpoint**: `/api/classes/:id`
* **Authorization**: Admin
* **Body**: None
* **Notes**: Cannot delete a class with assigned students.

---

## Subjects

### 21. Create Subject
* **Method**: POST
* **Endpoint**: `/api/subjects`
* **Authorization**: Admin
* **Body**:
```json
{
  "name": "Mathematics"
}
```

### 22. Get Subjects
* **Method**: GET
* **Endpoint**: `/api/subjects`
* **Authorization**: Admin, Teacher, or Student
* **Body**: None

### 23. Get Subject
* **Method**: GET
* **Endpoint**: `/api/subjects/:id`
* **Authorization**: Admin, Teacher, or Student
* **Body**: None

### 24. Update Subject
* **Method**: PUT
* **Endpoint**: `/api/subjects/:id`
* **Authorization**: Admin
* **Body**:
```json
{
  "name": "Further Mathematics"
}
```

### 25. Delete Subject
* **Method**: DELETE
* **Endpoint**: `/api/subjects/:id`
* **Authorization**: Admin
* **Body**: None
* **Notes**: Cannot delete a subject with existing results or assigned teachers.

---

## Results

### 26. Create Result
* **Method**: POST
* **Endpoint**: `/api/results`
* **Authorization**: Admin or Teacher
* **Body**:
```json
{
  "studentId": 1,
  "subjectId": 1,
  "score": 75,
  "term": "First Term",
  "session": "2025/2026"
}
```
* **Notes**:
  - `studentId` and `subjectId` must reference existing records.
  - `score` must be between 0 and 100.
  - `term` must be `First Term`, `Second Term`, or `Third Term`.
  - `session` must be format `YYYY/YYYY` with consecutive years (e.g. `2025/2026`).
  - `grade` is automatically calculated on the backend:
    - 70 - 100 = A
    - 60 - 69 = B
    - 50 - 59 = C
    - 45 - 49 = D
    - 40 - 44 = E
    - 0 - 39 = F

### 27. Get Results
* **Method**: GET
* **Endpoint**: `/api/results`
* **Authorization**: Admin, Teacher, or Student
* **Body**: None
* **Notes**: Students receive only their own results. Admins and teachers receive all results.

### 28. Get Result
* **Method**: GET
* **Endpoint**: `/api/results/:id`
* **Authorization**: Admin, Teacher, or Student
* **Body**: None
* **Notes**: Students can only view their own result; viewing another student's result returns 403 Forbidden.

### 29. Update Result
* **Method**: PUT
* **Endpoint**: `/api/results/:id`
* **Authorization**: Admin or Teacher
* **Body**:
```json
{
  "score": 88
}
```
* **Notes**: When `score` is updated, `grade` is automatically recalculated.

### 30. Delete Result
* **Method**: DELETE
* **Endpoint**: `/api/results/:id`
* **Authorization**: Admin
* **Body**: None
* **Notes**: Only admins can delete results. Teachers return 403 Forbidden.

---

## Authorization / Which Token to Use Where

| Route | Method | Admin | Teacher | Student |
|---|---|---|---|---|
| `/api/auth/register` | POST | Public | Public | Public |
| `/api/auth/login` | POST | Public | Public | Public |
| `/api/students` | POST | Allowed | Forbidden | Forbidden |
| `/api/students` | GET | Allowed | Allowed | Forbidden |
| `/api/students/:id` | GET | Allowed | Allowed | Forbidden |
| `/api/students/:id` | PUT | Allowed | Forbidden | Forbidden |
| `/api/students/:id` | DELETE | Allowed | Forbidden | Forbidden |
| `/api/students/profile` | GET | Forbidden | Forbidden | Own profile |
| `/api/teachers` | POST | Allowed | Forbidden | Forbidden |
| `/api/teachers` | GET | Allowed | Allowed | Forbidden |
| `/api/teachers/:id` | GET | Allowed | Allowed | Forbidden |
| `/api/teachers/:id` | PUT | Allowed | Forbidden | Forbidden |
| `/api/teachers/:id` | DELETE | Allowed | Forbidden | Forbidden |
| `/api/classes` | POST | Allowed | Forbidden | Forbidden |
| `/api/classes` | GET | Allowed | Allowed | Own class only |
| `/api/classes/:id` | GET | Allowed | Allowed | Own class only |
| `/api/classes/:id` | PUT | Allowed | Forbidden | Forbidden |
| `/api/classes/:id` | DELETE | Allowed | Forbidden | Forbidden |
| `/api/subjects` | POST | Allowed | Forbidden | Forbidden |
| `/api/subjects` | GET | Allowed | Allowed | Allowed |
| `/api/subjects/:id` | GET | Allowed | Allowed | Allowed |
| `/api/subjects/:id` | PUT | Allowed | Forbidden | Forbidden |
| `/api/subjects/:id` | DELETE | Allowed | Forbidden | Forbidden |
| `/api/results` | POST | Allowed | Allowed | Forbidden |
| `/api/results` | GET | Allowed | Allowed | Own results only |
| `/api/results/:id` | GET | Allowed | Allowed | Own result only |
| `/api/results/:id` | PUT | Allowed | Allowed | Forbidden |
| `/api/results/:id` | DELETE | Allowed | Forbidden | Forbidden |

> **Note on Teacher Access**: Teachers must have an active teacher profile created by an Admin (`POST /api/teachers`) with a matching email/userId to access teacher-restricted endpoints (such as viewing students or classes). If a user registered with role `teacher` attempts to access teacher endpoints before an Admin has created their teacher record, the request returns `403 Forbidden: "Teacher profile not found. An admin must create your teacher record first."`.

---

## Running the API

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Create a `.env` file in the root folder:
```env
PORT=5000
JWT_SECRET=your_secret_key
```

### 3. Start development server
```bash
npm run dev
```

### 4. Start production server
```bash
npm start
```

### 5. Postman Collection
Import `School_Management_System.postman_collection.json` into Postman to test all endpoints. Set the `token` variable with the JWT returned from `/api/auth/login`.
