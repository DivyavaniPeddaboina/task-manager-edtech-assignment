import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/auth/login", form);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        navigate(res.data.role === "teacher" ? "/teacher" : "/student");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#FFF7F2",
        display: "flex",
        padding: "20px"
      }}
    >
      <div
        className="p-4"
        style={{
          width: "430px",
          borderRadius: "16px",
          backgroundColor: "#EDE7FF",
          boxShadow: "0px 6px 22px rgba(0,0,0,0.07)",
          border: "2px solid #D6D3E6"
        }}
      >
        <h2 className="text-center mb-4" style={{ fontWeight: 600, color: "#444" }}>
          <FaSignInAlt style={{ marginRight: "10px", color: "#6B7280" }} />
          Login
        </h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaEnvelope color="#6B7280" />
              </span>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            className="btn w-100 py-2"
            style={{
              backgroundColor: "#6B9EF8",
              color: "white",
              fontSize: "1.1rem",
              fontWeight: 600,
              border: "none"
            }}
          >
            Login
          </button>

          <p
            className="text-center mt-3"
            style={{
              cursor: "pointer",
              color: "#555",
              fontSize: "0.95rem",
              fontWeight: 500
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            onClick={() => navigate("/signup")}
          >
            Don’t have an account? Signup here
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;