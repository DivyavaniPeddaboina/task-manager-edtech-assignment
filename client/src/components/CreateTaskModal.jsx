import { useState } from "react";
import axios from "axios";

function CreateTaskModal({ close, refresh }) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    progress: "not-started"
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/tasks",
        form,
        {
          headers: { Authorization: localStorage.getItem("token") }
        }
      );

      if (res.data.success) {
        refresh();     // reload tasks on dashboard
        close();       // close modal
      }
    } catch (err) {
      setError(err.response?.data?.message || "Task creation failed");
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div style={overlayStyle} />

      {/* Modal Box */}
      <div style={modalStyle}>
        <h3 style={{ marginBottom: "15px" }}>Create New Task</h3>

        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label className="form-label fw-semibold">Title</label>
          <input
            type="text"
            name="title"
            className="form-control mb-3"
            placeholder="Task title"
            onChange={handleChange}
            required
          />

          <label className="form-label fw-semibold">Description</label>
          <textarea
            name="description"
            className="form-control mb-3"
            placeholder="Task details"
            rows="3"
            onChange={handleChange}
            required
          />

          <label className="form-label fw-semibold">Due Date</label>
          <input
            type="date"
            name="dueDate"
            className="form-control mb-3"
            onChange={handleChange}
          />

          <label className="form-label fw-semibold">Progress</label>
          <select
            name="progress"
            className="form-select mb-4"
            onChange={handleChange}
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button className="btn btn-primary w-100 mb-2">Create Task</button>
          <button
            type="button"
            className="btn btn-secondary w-100"
            onClick={close}
          >
            Cancel
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateTaskModal;

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.4)",
  backdropFilter: "blur(2px)",
  zIndex: 10
};

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "420px",
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
  zIndex: 11,
  animation: "fadeIn 0.2s ease-out"
};