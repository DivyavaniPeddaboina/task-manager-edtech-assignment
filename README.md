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
task-manager-edtech-assignment/
│
├── client/                # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── index.html
│
└── server/                # Node.js Backend
    ├── models/            # User & Task schema
    ├── routes/            # Auth & Tasks routes
    ├── middleware/        # JWT auth middleware
    └── index.js
    
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

Method	Endpoint	Description	Auth

POST	/auth/signup	Register user	No
POST	/auth/login	Login & receive JWT token	No
GET	/auth/me	Get logged-in user + teacher info	Yes
GET	/auth/teachers	Get all teachers	No
GET	/tasks	Get tasks based on role logic	Yes
POST	/tasks	Create a new task	Yes
PUT	/tasks/:id	Update task progress	Yes
DELETE	/tasks/:id	Delete a task	Yes

🖼 Screenshots
<img width="1920" height="1080" alt="SignUp Page" src="https://github.com/user-attachments/assets/08c0b1ac-6bda-4a9a-a69b-c61705bd2ef7" />
<img width="1920" height="1080" alt="Login Page" src="https://github.com/user-attachments/assets/8723ba41-4a81-4742-96a9-1a311b03b0b3" />
<img width="1920" height="1080" alt="Teacher Dashboard" src="https://github.com/user-attachments/assets/caefacf5-20c9-436d-8484-422e14cdbb1b" />
<img width="1920" height="1080" alt="Task Creation Form by Teacher" src="https://github.com/user-attachments/assets/02f70c76-fe7b-4657-9637-4d59cc1f190a" />
<img width="1920" height="1080" alt="Updated Teacher Dashboard with tasks" src="https://github.com/user-attachments/assets/c023e6c1-b079-4719-997f-3c69535dfd99 " />
<img width="1920" height="1080" alt="Student SignUp Page" src="https://github.com/user-attachments/assets/4e06b083-3e41-45ac-a905-a996b96345db" />
<img width="1920" height="1080" alt="Student Login Page" src="https://github.com/user-attachments/assets/914a250a-3ab8-429d-a990-8bd6a575bd7a" />
<img width="1920" height="1080" alt="Student Dashboard" src="https://github.com/user-attachments/assets/b2420266-357b-4da6-bf1e-0942bce16689" />

🤖 AI Usage Declaration
## AI Usage Statement
I used AI tools (ChatGPT) for debugging support, UI improvements, and generating explanations.  
All final code, logic, and implementation were understood and written by me.
