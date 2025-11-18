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

/* ---------- styles at top ---------- */
const pageWrapper = {
  minHeight: "100vh",
  width: "100%",
  padding: "40px",
  background: "linear-gradient(to right, #F8FBFF, #EEF4FF)",
  display: "flex",
  justifyContent: "center"
};

const container = { width: "100%", maxWidth: 1100 };
const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 16
};
const titleStyle = { fontSize: "1.8rem", margin: 0, fontWeight: 700 };
const logoutBtn = {
  background: "#F2F2F2",
  border: "2px solid #E0E0E0",
  padding: "8px 14px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600
};
const statsRow = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 16,
  marginBottom: 18
};
const statCardStyle = {
  padding: 18,
  borderRadius: 12,
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
};
const filterRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "18px 0"
};
const searchStyle = {
  width: "60%",
  padding: "10px",
  borderRadius: 8,
  border: "1px solid #CCC"
};
const chipStyle = {
  padding: "8px 12px",
  borderRadius: 20,
  border: "1px solid #DDD",
  cursor: "pointer",
  fontWeight: 600
};
const tableCard = {
  background: "white",
  borderRadius: 12,
  padding: 18,
  boxShadow: "0 6px 22px rgba(0,0,0,0.05)"
};

/* ---------- StatsCard ---------- */
function StatsCard({ title, count, icon, bg }) {
  return (
    <div style={{ ...statCardStyle, backgroundColor: bg }}>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ fontWeight: 800, fontSize: 18 }}>{count}</div>
    </div>
  );
}

/* ---------- MAIN COMPONENT ---------- */
function StudentDashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [teacherName, setTeacherName] = useState("Not available");

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  /* ---------- Load student + teacher info ---------- */
  const loadStudentInfo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/me", {
        headers: { Authorization: localStorage.getItem("token") }
      });

      const user = res.data.user;
      console.log("STUDENT INFO:", user);

      setStudentName(user.name || "");

      if (user.teacherId?.name) {
        setTeacherName(user.teacherId.name);
      } else {
        setTeacherName("Not available");
      }
    } catch (err) {
      console.log("ME ERROR:", err);
    }
  };

  /* ---------- Load Tasks ---------- */
  const loadTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/tasks", {
        headers: { Authorization: token }
      });

      setTasks(res.data.tasks || []);
    } catch (err) {
      console.log("TASK LOAD ERROR:", err);
    }
  };

  /* ---------- lifecycle ---------- */
 useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  const fetchEverything = async () => {
    await loadStudentInfo();
    await loadTasks();
    setLoading(false);
  };

  fetchEverything();
}, []);

  /* logout */
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* progress update */
  const updateProgress = async (id, newP) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/tasks/${id}`,
        { progress: newP },
        { headers: { Authorization: token } }
      );
      setTasks(prev =>
        prev.map(t => (t._id === id ? { ...t, progress: newP } : t))
      );
    } catch {
      alert("Could not update");
    }
  };

  /* delete */
  const deleteTask = async (id) => {
    if (!confirm("Delete?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/tasks/${id}`, {
        headers: { Authorization: token }
      });
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch {
      alert("Could not delete");
    }
  };

  /* filtering + searching */
  const filtered = tasks.filter(t => {
    const matchesFilter = filter === "all" ? true : t.progress === filter;
    const s = search.toLowerCase();
    const matchesSearch =
      !s ||
      t.title.toLowerCase().includes(s) ||
      (t.description || "").toLowerCase().includes(s);
    return matchesFilter && matchesSearch;
  });

  const total = tasks.length;
  const notStarted = tasks.filter(t => t.progress === "not-started").length;
  const inProgress = tasks.filter(t => t.progress === "in-progress").length;
  const completed = tasks.filter(t => t.progress === "completed").length;

  return (
    <div style={pageWrapper}>
      <div style={container}>
        {/* Header */}
        <div style={headerRow}>
          <div>
            <h1 style={titleStyle}>Student Dashboard</h1>
            <p style={{ margin: 0, color: "#666" }}>
              Welcome back! {studentName}
            </p>

            <p style={{ marginTop: 8, color: "#444", fontSize: 14 }}>
              <strong>Your Teacher:</strong> {teacherName || "Not available"}
            </p>
          </div>

          <button style={logoutBtn} onClick={logout}>
            <FaPowerOff /> Logout
          </button>
        </div>

        {/* Stats */}
        <div style={statsRow}>
          <StatsCard title="Total Tasks" count={total} icon={<FaClipboardList />} bg="#E4EBFF" />
          <StatsCard title="Not Started" count={notStarted} icon={<FaTasks />} bg="#FFF2D9" />
          <StatsCard title="In Progress" count={inProgress} icon={<FaSpinner />} bg="#E2F2FF" />
          <StatsCard title="Completed" count={completed} icon={<FaCheckCircle />} bg="#E3FFD9" />
        </div>

        {/* Filters */}
        <div style={filterRow}>
          <input
            type="text"
            placeholder="Search tasks..."
            style={searchStyle}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div style={{ display: "flex", gap: 8 }}>
            {["all", "not-started", "in-progress", "completed"].map(f => (
              <button
                key={f}
                style={{
                  ...chipStyle,
                  background: filter === f ? "#4F8BFF" : "white",
                  color: filter === f ? "white" : "#333"
                }}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div style={tableCard}>
          <h3>Your Tasks</h3>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: 24 }}>No tasks found</td></tr>
                )}

                {filtered.map(t => (
                  <tr key={t._id}>
                    <td>{t.title}</td>
                    <td style={{ maxWidth: 320 }}>{t.description}</td>
                    <td>{t.dueDate?.substring(0, 10) || "-"}</td>

                    <td>
                      <select
                        value={t.progress}
                        onChange={(e) => updateProgress(t._id, e.target.value)}
                        style={{ padding: "6px 10px", borderRadius: 8 }}
                      >
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>

                    <td>
                      <button
                        onClick={() => deleteTask(t._id)}
                        style={{
                          background: "#ff6b6b",
                          color: "white",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: 8,
                          cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;