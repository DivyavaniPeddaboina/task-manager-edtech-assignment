📘 EdTech Task Manager – MERN Assignment

A role-based task management system built using React (Vite), Node.js, Express, and MongoDB, supporting teachers and students with restricted access, authentication, and task management features.

This project implements all required functionalities from the EdTech Take-Home Assignment including:

Secure login/signup

JWT-based authorization

Restricted task visibility

Teacher → Student task assignment

Task CRUD operations

Student progress updates

Data filtering and UI improvements

🌐 Live Features Overview

👨‍🏫 Teacher Capabilities

Create tasks (title, description, due date)

View all tasks created by the teacher

Students linked to this teacher can see these tasks

Clean UI to manage work

Logout


👩‍🎓 Student Capabilities

Choose a teacher during signup

View only their teacher’s tasks

Update task progress:

✔ Not Started

✔ In Progress

✔ Completed


Delete their task progress entry (if allowed)

See their teacher’s name and personal name on dashboard

Logout

🏛️ Tech Stack

Frontend

React (Vite)

Axios

Bootstrap + custom CSS

React Icons


Backend

Node.js

Express.js

MongoDB + Mongoose

JWT authentication

Middleware-based role checks

📂 Project Structure
Root Folder
task-manager-edtech-assignment/
│
├── client/        → React frontend
├── server/        → Node.js + Express backend
└── README.md

Frontend(client/)
client/
│
├── index.html
├── package.json
├── vite.config.js
│
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    │
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── SignupPage.jsx
    │   ├── TeacherDashboard.jsx
    │   └── StudentDashboard.jsx
    │
    └── components/
        └── CreateTaskModal.jsx

Backend(server/)
server/
│
├── server.js
├── package.json
│
├── config/
│   └── db.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── User.js
│   └── Task.js
│
└── routes/
    ├── auth.js
    └── tasks.js
    
🚀 Installation & Setup
 1. Clone Repository
    git clone https://github.com/DivyavaniPeddaboina/task-manager-edtech-assignment.git
    cd task-manager-edtech-assignment
    
🖥 Backend Setup (Node.js + Express)
  cd server
  npm install
  
Create a .env file:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Run server:
npm run dev

🎨 Frontend Setup (React + Vite)
cd client
npm install
npm run dev
The frontend runs at:

👉 http://localhost:5173

The backend runs at:

👉 http://localhost:5000
🔑 Authentication Flow

Signup fields:

name

email

password

role (teacher/student)

teacherId (only if student)


Login returns:

JWT token

Role

UserId


Token is stored in localStorage:
localStorage.setItem("token", token)
localStorage.setItem("role", role)

Every protected route includes:
Authorization: token

🧠 Role-Based Access Logic

Teacher
Creates tasks → saved with teacherId = req.user.id

Sees only own tasks:
Task.find({ teacherId: user._id })

Student
During signup → chooses a teacher from dropdown (name shown, value saved as _id).
Student sees only tasks of selected teacher:
Task.find({ teacherId: user.teacherId })
Student also sees:
Welcome back! {studentName}
Your Teacher: {teacherName}
📝 API Documentation (Summary)

1. POST /auth/signup
Purpose: Register a new user
Auth Required: No
Request Body:
name
email
password
role ("teacher" or "student")
teacherId (only if role = student)
Response: User created + JWT token

2. POST /auth/login
Purpose: Login and get JWT token
Auth Required: No
Request Body:
email
password
Response: JWT token and user info

3. GET /auth/me
Purpose: Get logged-in user's details
Auth Required: Yes
Response: User data (name, email, role, teacherId)

4. GET /auth/teachers
Purpose: Fetch all users who are teachers
Auth Required: No
Response: List of teachers (name + email + id)

5. GET /tasks
Purpose: Get tasks based on user role
Auth Required: Yes
Logic:
If teacher → return teacher’s own tasks
If student → return tasks created by their assigned teacher

Response: List of tasks
6. POST /tasks
Purpose: Create a new task
Auth Required: Yes
Only teachers create tasks
Request Body:
title
description
dueDate
Response: Created task

7. PUT /tasks/:id
Purpose: Update task progress
Auth Required: Yes
Only students update progress
Request Body:
progress ("not-started", "in-progress", "completed")
Response: Updated task

8. DELETE /tasks/:id
Purpose: Delete a task
Auth Required: Yes
Only the teacher who created the task can delete it
Response: Task deleted

🖼 Screenshots
<img width="1920" height="1080" alt="SignUp Page" src="https://github.com/user-attachments/assets/08c0b1ac-6bda-4a9a-a69b-c61705bd2ef7" />
<img width="1920" height="1080" alt="Login Page" src="https://github.com/user-attachments/assets/8723ba41-4a81-4742-96a9-1a311b03b0b3" />
<img width="1920" height="1080" alt="Teacher Dashboard" src="https://github.com/user-attachments/assets/caefacf5-20c9-436d-8484-422e14cdbb1b" />
<img width="1920" height="1080" alt="Task Creation Form by Teacher" src="https://github.com/user-attachments/assets/02f70c76-fe7b-4657-9637-4d59cc1f190a" />
<img width="1920" height="1080" alt="Updated Teacher Dashboard with tasks" src="https://github.com/user-attachments/assets/c023e6c1-b079-4719-997f-3c69535dfd99 " />
<img width="1920" height="1080" alt="Student SignUp Page" src="https://github.com/user-attachments/assets/4e06b083-3e41-45ac-a905-a996b96345db" />
<img width="1920" height="1080" alt="Student Login Page" src="https://github.com/user-attachments/assets/914a250a-3ab8-429d-a990-8bd6a575bd7a" />
<img width="1920" height="1080" alt="Student Dashboard" src="https://github.com/user-attachments/assets/b2420266-357b-4da6-bf1e-0942bce16689" />

🎥 Video Walkthrough
https://drive.google.com/file/d/1V2k3xJV2_IEooX-vsQ4k8iet0QBpH-7O/view?usp=sharing
[Click here to watch]

🤖 AI Usage Declaration
## AI Usage Statement
I used AI tools (ChatGPT) for debugging support, UI improvements, and generating explanations.  
All final code, logic, and implementation were understood and written by me.

🐞 Known Issues
UI can be further optimized for mobile view.
- Additional validation can be added for form fields.
- Task pagination not implemented (bonus feature).

✨ Future Improvements

Deploy frontend & backend (Render)

Pagination for teacher tasks

Overdue task filtering

Attachments in tasks
