import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentLogin() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clear any old session data first
      localStorage.clear();

      const res = await axios.post("${import.meta.env.VITE_API_URL}/api/auth/login", {
        rollNo,
        password,
        role: "student",
      });

      // Save token and user details
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("rollNo", res.data.rollNo);
      localStorage.setItem("userName", res.data.name);

      // Redirect to the Student Dashboard
      navigate("/student-dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      alert(err.response?.data?.message || "Invalid Roll Number or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial" }}>
      <div style={{ display: "inline-block", padding: "30px", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
        <h2>Student Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Roll Number "
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              style={{ padding: "10px", width: "250px", borderRadius: "5px", border: "1px solid #ddd" }}
              required
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: "10px", width: "250px", borderRadius: "5px", border: "1px solid #ddd" }}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;