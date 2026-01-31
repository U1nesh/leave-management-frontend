import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const rollNo = localStorage.getItem("rollNo");

  useEffect(() => {
    if (!token) navigate("/");
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      // FIXED: Backticks used for dynamic URL
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/my-leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLeaves(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading leaves:", err);
    }
  };

  const applyLeave = async (e) => {
    e.preventDefault();
    try {
      // FIXED: Backticks used for dynamic URL
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason, fromDate, toDate }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Leave applied successfully!");
        setReason(""); setFromDate(""); setToDate("");
        loadLeaves();
      } else {
        alert(data.message || "Failed to apply leave");
      }
    } catch (err) {
      console.error("Apply Leave Error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Welcome, {userName}</h2>
        <button onClick={handleLogout} style={{ padding: "8px 15px", cursor: "pointer" }}>Logout</button>
      </div>
      <p>Roll Number: {rollNo}</p>

      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "10px", marginTop: "20px" }}>
        <h3>Apply for New Leave</h3>
        <form onSubmit={applyLeave}>
          <input type="text" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} required style={{ padding: "8px", marginRight: "10px" }} />
          <label>From: </label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required style={{ padding: "8px", marginRight: "10px" }} />
          <label>To: </label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required style={{ padding: "8px", marginRight: "10px" }} />
          <button type="submit" style={{ padding: "8px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Submit Application</button>
        </form>
      </div>

      <h3 style={{ marginTop: "30px" }}>My Leave History</h3>
      <table border="1" width="100%" style={{ marginTop: "10px", textAlign: "left", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: "10px" }}>Reason</th>
            <th style={{ padding: "10px" }}>From</th>
            <th style={{ padding: "10px" }}>To</th>
            <th style={{ padding: "10px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id}>
              <td style={{ padding: "10px" }}>{leave.reason}</td>
              <td style={{ padding: "10px" }}>{new Date(leave.fromDate).toLocaleDateString()}</td>
              <td style={{ padding: "10px" }}>{new Date(leave.toDate).toLocaleDateString()}</td>
              <td style={{ padding: "10px", fontWeight: "bold", color: leave.status === "Approved" ? "green" : leave.status === "Rejected" ? "red" : "orange" }}>
                {leave.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDashboard;