import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    teacherId: ""
  });

  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // load teachers for dropdown
  useEffect(() => {
    const loadTeachers = async () => {
      setLoadingTeachers(true);
      try {
        const res = await axios.get("http://localhost:5000/auth/teachers");
        if (res.data && res.data.teachers) {
          setTeachers(res.data.teachers);
        } else {
          setTeachers([]);
        }
      } catch (err) {
        console.error("Error loading teachers:", err);
        setTeachers([]);
      } finally {
        setLoadingTeachers(false);
      }
    };

    loadTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // build payload including name and teacherId conditionally
    const data = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role
    };

    if (form.role === "student") {
      data.teacherId = form.teacherId;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/signup", data);

      if (res.data && res.data.success) {
        // Signup success -> go to login
        navigate("/");
      } else {
        setError(res.data?.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#FFF7F2",
        padding: "20px"
      }}
    >
      <div
        className="p-4"
        style={{
          width: "480px",
          borderRadius: "20px",
          backgroundColor: "#EDE7FF",
          boxShadow: "0px 8px 28px rgba(0,0,0,0.09)",
          border: "2px solid #D6D3E6"
        }}
      >
        {/* Title */}
        <h2
          className="text-center mb-4"
          style={{ fontWeight: 600, color: "#333", fontSize: "1.6rem" }}
        >
          <FaUser style={{ marginRight: "10px", color: "#5B6270" }} />
          Create Account
        </h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              onChange={handleChange}
              value={form.name}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaEnvelope color="#6B7280" />
              </span>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter email"
                onChange={handleChange}
                value={form.email}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaLock color="#6B7280" />
              </span>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Create password"
                onChange={handleChange}
                value={form.password}
                required
              />
            </div>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Select Role</label>
            <select
              className="form-select"
              name="role"
              required
              onChange={handleChange}
              value={form.role}
            >
              <option value="">Choose role</option>
              <option value="teacher">teacher</option>
              <option value="student">student</option>
            </select>
          </div>

          {/* Teacher selection only for students */}
          {form.role === "student" && (
            <div className="mb-4">
              <label className="form-label fw-semibold">Select Teacher</label>
              <select
                className="form-select"
                name="teacherId"
                required
                onChange={handleChange}
                value={form.teacherId}
              >
                <option value="">Choose teacher</option>
                {loadingTeachers ? (
                  <option disabled>Loading teachers...</option>
                ) : (
                  teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name || t.email}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {/* Signup button */}
          <button
            className="btn w-100 py-2"
            style={{
              backgroundColor: "#6B9EF8",
              color: "white",
              fontSize: "1.1rem",
              fontWeight: 600,
              border: "none",
              borderRadius: "8px"
            }}
          >
            Signup
          </button>

          {/* Link */}
          <p
            className="text-center mt-3"
            style={{
              cursor: "pointer",
              color: "#444",
              fontSize: "0.95rem",
              fontWeight: 500
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            onClick={() => navigate("/")}
          >
            Already have an account? Login
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;