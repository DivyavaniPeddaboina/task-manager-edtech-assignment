import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaTasks,
  FaSpinner,
  FaCheckCircle,
  FaPowerOff
} from "react-icons/fa";

function TeacherDashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  // Load all tasks created by this teacher
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
        backgroundColor: "#FFF7F2",
        minHeight: "100vh",
        padding: "25px",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "25px",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontWeight: 700, color: "#333" }}>Teacher Dashboard</h2>

        <button
          onClick={logout}
          style={{
            backgroundColor: "#EDE7FF",
            border: "2px solid #D6D3E6",
            borderRadius: "8px",
            padding: "8px 16px",
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
          marginBottom: "25px",
        }}
      >
        <StatsCard
          title="Total Tasks"
          count={tasks.length}
          icon={<FaClipboardList />}
          bg="#EDE7FF"
        />

        <StatsCard
          title="Not Started"
          count={tasks.filter(t => t.progress === "not-started").length}
          icon={<FaTasks />}
          bg="#FFEFE2"
        />

        <StatsCard
          title="In Progress"
          count={tasks.filter(t => t.progress === "in-progress").length}
          icon={<FaSpinner />}
          bg="#E2F0FF"
        />

        <StatsCard
          title="Completed"
          count={tasks.filter(t => t.progress === "completed").length}
          icon={<FaCheckCircle />}
          bg="#E8FFE7"
        />
      </div>

      {/* Task Table Section */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0px 6px 22px rgba(0,0,0,0.06)",
          border: "2px solid #EEE",
        }}
      >
        <h4 style={{ fontWeight: 600, marginBottom: "20px" }}>
          All Assigned Tasks
        </h4>

        {/* Task Table */}
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
        padding: "18px",
        boxShadow: "0px 6px 22px rgba(0,0,0,0.07)",
        border: "2px solid rgba(0,0,0,0.06)",
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
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Student</th>
          <th>Task</th>
          <th>Due Date</th>
          <th>Progress</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task) => (
          <tr key={task._id}>
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