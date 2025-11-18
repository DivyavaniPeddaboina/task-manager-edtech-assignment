import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaClipboardList, FaPowerOff, FaPlus } from "react-icons/fa";
import CreateTaskModal from "../components/CreateTaskModal";

function TeacherDashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [teacherName, setTeacherName] = useState("");

  /* ---------- Load teacher info ---------- */
  const loadTeacherInfo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/me", {
        headers: { Authorization: localStorage.getItem("token") }
      });

      setTeacherName(res.data.user.name); // ⭐ Teacher Name
    } catch (err) {
      console.log("TEACHER INFO ERROR:", err);
    }
  };

  /* ---------- Load teacher tasks ---------- */
  const loadTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("TASK FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    loadTeacherInfo();
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
        width: "100%",
        padding: "40px",
        background: "linear-gradient(to right, #F8FBFF, #EEF4FF)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* ---------- Header ---------- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ fontWeight: 700, color: "#2B2D42" }}>
              Teacher Dashboard
            </h1>
            <p style={{ margin: 0, fontSize: "1rem", color: "#555" }}>
              Welcome back! {teacherName} {/* ⭐ Teacher Name */}
            </p>
          </div>

          <button
            onClick={logout}
            style={{
              backgroundColor: "#E8ECF7",
              border: "2px solid #D0D6E3",
              borderRadius: "10px",
              padding: "8px 18px",
              fontWeight: 600,
              color: "#333",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaPowerOff />
            Logout
          </button>
        </div>

        {/* ---------- Stats Section (ONLY total tasks now) ---------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "20px",
            marginBottom: "25px",
            maxWidth: "300px",
          }}
        >
          <StatsCard
            title="Total Tasks Created"
            count={tasks.length}
            icon={<FaClipboardList />}
            bg="#E4EBFF"
          />
        </div>

        {/* ---------- Create Task Button ---------- */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: "#4A90E2",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "25px",
          }}
        >
          <FaPlus />
          Create Task
        </button>

        {/* ---------- Task Table ---------- */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0px 6px 22px rgba(0,0,0,0.05)",
            border: "2px solid #EEE",
          }}
        >
          <h3 style={{ fontWeight: 600, marginBottom: "20px" }}>
            Your Assigned Tasks
          </h3>

          <TeacherTaskTable tasks={tasks} />
        </div>
      </div>

      {/* ---------- Task Modal ---------- */}
      {showModal && (
        <CreateTaskModal close={() => setShowModal(false)} refresh={loadTasks} />
      )}
    </div>
  );
}

export default TeacherDashboard;

/* ---------- StatsCard Component ---------- */
function StatsCard({ title, count, icon, bg }) {
  return (
    <div
      style={{
        backgroundColor: bg,
        borderRadius: "18px",
        padding: "20px",
        boxShadow: "0px 6px 22px rgba(0,0,0,0.07)",
        border: "2px solid rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{icon}</div>
      <h4 style={{ fontWeight: 600, color: "#333" }}>{title}</h4>
      <p style={{ fontWeight: 700, fontSize: "1.4rem", color: "#111" }}>
        {count}
      </p>
    </div>
  );
}

/* ---------- Task Table ---------- */
function TeacherTaskTable({ tasks }) {
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Task</th>
          <th>Description</th>
          <th>Due Date</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task) => (
          <tr key={task._id}>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>{task.dueDate?.substring(0, 10)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}