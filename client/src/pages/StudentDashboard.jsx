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

function StudentDashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);          // holds current user (student)
  const [teacherEmail, setTeacherEmail] = useState(null); // to show teacher info
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // load tasks and user info
  const loadAll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // 1) load tasks for logged-in user
      const tasksRes = await axios.get("http://localhost:5000/tasks", {
        headers: { Authorization: token },
      });

      setTasks(tasksRes.data.tasks || []);

      // 2) try to load user info (server may expose /auth/me)
      try {
        const me = await axios.get("http://localhost:5000/auth/me", {
          headers: { Authorization: token },
        });
        setUser(me.data.user || null);

        // if user has teacherId and server returned populated teacher email
        if (me.data.user?.teacherId?.email) {
          setTeacherEmail(me.data.user.teacherId.email);
        } else if (me.data.user?.teacherId) {
          // teacherId is present but not populated; try fetch teacher
          try {
            const t = await axios.get(
              `http://localhost:5000/auth/user/${me.data.user.teacherId}`,
              { headers: { Authorization: token } }
            );
            setTeacherEmail(t.data.user?.email || null);
          } catch {
            setTeacherEmail(null);
          }
        }
      } catch {
        // if /auth/me not available, still continue (optional)
        setUser(null);
        setTeacherEmail(null);
      }
    } catch (err) {
      console.error("LOAD ERROR:", err);
      // if unauthorized, redirect to login
      if (err?.response?.status === 401) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // inline progress update
  const updateProgress = async (taskId, newProgress) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/tasks/${taskId}`,
        { progress: newProgress },
        { headers: { Authorization: token } }
      );
      // refresh tasks (light and safe)
      setTasks((prev) => prev.map(t => t._id === taskId ? { ...t, progress: newProgress } : t));
    } catch (err) {
      console.error("UPDATE PROGRESS ERROR:", err);
      alert(err.response?.data?.message || "Could not update task");
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm("Delete this task? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
        headers: { Authorization: token },
      });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert(err.response?.data?.message || "Could not delete task");
    }
  };

  // filtering + searching
  const filtered = tasks.filter((t) => {
    const matchesFilter = filter === "all" ? true : t.progress === filter;
    const s = search.trim().toLowerCase();
    const matchesSearch =
      !s ||
      t.title.toLowerCase().includes(s) ||
      (t.description || "").toLowerCase().includes(s);
    return matchesFilter && matchesSearch;
  });

  // stats
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
            <p style={{ margin: 0, color: "#666" }}>Welcome back!</p>
            {/* teacher info under title */}
            <p style={{ marginTop: 8, color: "#444", fontSize: 14 }}>
              <strong>Your Teacher:</strong> {teacherEmail || "Not available"}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button style={logoutBtn} onClick={logout}>
              <FaPowerOff /> Logout
            </button>
          </div>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchStyle}
          />

          <div style={{ display: "flex", gap: 8 }}>
            {["all", "not-started", "in-progress", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  ...chipStyle,
                  backgroundColor: filter === f ? "#4F8BFF" : "white",
                  color: filter === f ? "white" : "#333"
                }}
              >
                {f === "all" ? "All" : f.replace("-", " ").replace(/\b\w/g, c=>c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        <div style={tableCard}>
          <h3 style={{ marginTop: 0 }}>Your Tasks</h3>

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

                {filtered.map((t) => (
                  <tr key={t._id}>
                    <td>{t.title}</td>
                    <td style={{ maxWidth: 320 }}>{t.description}</td>
                    <td>{t.dueDate ? t.dueDate.substring(0,10) : "-"}</td>

                    {/* inline progress dropdown */}
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
                        style={{ background: "#ff6b6b", color: "white", border: "none", padding: "6px 10px", borderRadius: 8, cursor: "pointer" }}
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

/* ----------------- small components & styles ----------------- */

function StatsCard({ title, count, icon, bg }) {
  return (
    <div style={{ ...statCardStyle, backgroundColor: bg }}>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ fontWeight: 800, fontSize: 18 }}>{count}</div>
    </div>
  );
}

/* ---------- styles ---------- */
const pageWrapper = {
  minHeight: "100vh",
  width: "100%",
  padding: "40px",
  background: "linear-gradient(to right, #F8FBFF, #EEF4FF)",
  display: "flex",
  justifyContent: "center"
};

const container = {
  width: "100%",
  maxWidth: 1100
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 16
};

const titleStyle = { fontSize: "1.8rem", margin: 0, fontWeight: 700 };
const logoutBtn = {
  background: "#F2F2F2", border: "2px solid #E0E0E0", padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 600
};

const statsRow = { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 18 };
const statCardStyle = { padding: 18, borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" };

const filterRow = { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0" };
const searchStyle = { width: "60%", padding: "10px", borderRadius: 8, border: "1px solid #CCC" };
const chipStyle = { padding: "8px 12px", borderRadius: 20, border: "1px solid #DDD", cursor: "pointer", fontWeight: 600 };

const tableCard = { background: "white", borderRadius: 12, padding: 18, boxShadow: "0 6px 22px rgba(0,0,0,0.05)" };