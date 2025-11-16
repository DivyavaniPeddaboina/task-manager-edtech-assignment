import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaTasks,
  FaSpinner,
  FaCheckCircle,
  FaPowerOff,
  FaPlus
} from "react-icons/fa";

function TeacherDashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tasks", {
          headers: { Authorization: localStorage.getItem("token") }
        });
        setTasks(res.data.tasks);
      } catch (err) {
        console.error(err);
      }
    };

    loadTasks();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "linear-gradient(to bottom right, #FDFBFF, #F5F8FF)",
        animation: "fadeIn 0.8s ease"
      }}
    >
      {/* Top Header */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px 30px",
          borderRadius: "14px",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.06)",
          marginBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <h1 style={{ fontWeight: 700, color: "#333", letterSpacing: "0.5px" }}>
            Teacher Dashboard
          </h1>
          <p style={{ margin: 0, color: "#666" }}>Welcome back!</p>
        </div>

        <button
          onClick={logout}
          style={{
            backgroundColor: "#F2F4FF",
            border: "2px solid #D6D8FA",
            borderRadius: "8px",
            padding: "8px 18px",
            fontWeight: 600,
            color: "#333",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <FaPowerOff />
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <StatsCard
          title="Total Tasks"
          count={tasks.length}
          icon={<FaClipboardList />}
          bg="#EDEAFF"
        />

        <StatsCard
          title="Not Started"
          count={tasks.filter(t => t.progress === "not-started").length}
          icon={<FaTasks />}
          bg="#FFF4DA"
        />

        <StatsCard
          title="In Progress"
          count={tasks.filter(t => t.progress === "in-progress").length}
          icon={<FaSpinner />}
          bg="#E3F1FF"
        />

        <StatsCard
          title="Completed"
          count={tasks.filter(t => t.progress === "completed").length}
          icon={<FaCheckCircle />}
          bg="#E4FFE7"
        />
      </div>

      {/* Create Task Button */}
      <div style={{ marginBottom: "20px", textAlign: "right" }}>
        <button
          style={{
            backgroundColor: "#6B9EF8",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: 600,
            fontSize: "1rem",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/teacher/create-task")}
        >
          <FaPlus />
          Create Task
        </button>
      </div>

      {/* Task List */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0px 6px 22px rgba(0,0,0,0.08)",
          border: "2px solid #EEE",
        }}
      >
        <h4 style={{ fontWeight: 600, marginBottom: "20px" }}>
          All Assigned Tasks
        </h4>

        <TeacherTaskTable tasks={tasks} />
      </div>
    </div>
  );
}

export default TeacherDashboard;

/* ---------------- STATS CARD COMPONENT ---------------- */

function StatsCard({ title, count, icon, bg }) {
  return (
    <div
      style={{
        backgroundColor: bg,
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0px 4px 16px rgba(0,0,0,0.05)",
        border: "1px solid rgba(0,0,0,0.05)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.04)";
        e.currentTarget.style.boxShadow = "0px 8px 26px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0px 4px 16px rgba(0,0,0,0.05)";
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{icon}</div>
      <h5 style={{ fontWeight: 600 }}>{title}</h5>
      <p style={{ fontWeight: 700, fontSize: "1.4rem" }}>{count}</p>
    </div>
  );
}

/* ---------------- TASK TABLE COMPONENT ---------------- */

function TeacherTaskTable({ tasks }) {
  return (
    <table className="table table-hover" style={{ borderRadius: "12px", overflow: "hidden" }}>
      <thead style={{ backgroundColor: "#F4F6FF" }}>
        <tr>
          <th>Student</th>
          <th>Task</th>
          <th>Due Date</th>
          <th>Progress</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task, index) => (
          <tr
            key={task._id}
            style={{
              backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9FAFF",
            }}
          >
            <td>{task.userId}</td>
            <td>{task.title}</td>
            <td>{task.dueDate?.substring(0, 10)}</td>
            <td>
              <span
                style={{
                  backgroundColor:
                    task.progress === "completed"
                      ? "#D4FFE0"
                      : task.progress === "in-progress"
                        ? "#E8F2FF"
                        : "#FFECE8",
                  padding: "6px 12px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                {task.progress}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}