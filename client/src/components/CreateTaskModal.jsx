import { useState } from "react";
import axios from "axios";

function CreateTaskModal({ close, refresh }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/tasks",
        {
          title: form.title,
          description: form.description,
          dueDate: form.dueDate
        },
        { headers: { Authorization: token } }
      );

      refresh();   // Reload tasks
      close();     // Close modal

    } catch (err) {
      console.error("CREATE TASK ERROR:", err);
      alert("Could not create task");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      <div
        style={{
          width: "500px",
          background: "white",
          padding: "25px",
          borderRadius: "14px",
          boxShadow: "0px 6px 22px rgba(0,0,0,0.15)",
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: "20px" }}>
          Create New Task
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="description"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Due Date</label>
            <input
              type="date"
              name="dueDate"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={close}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ background: "#4A90E2", border: "none" }}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;