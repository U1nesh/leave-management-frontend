import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const rollNo = localStorage.getItem("rollNo");
  const userName = localStorage.getItem("userName") || "Student";
  const token = localStorage.getItem("token");
  
  const [leaves, setLeaves] = useState([]);
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadLeaves = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/my-leaves`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setLeaves(Array.isArray(data) ? data : []);
  };

  useEffect(() => { 
    if (!token) navigate("/");
    loadLeaves(); 
  }, []);

  const applyLeave = async (e) => {
    e.preventDefault();
    const res = await fetch("${import.meta.env.VITE_API_URL}/api/leaves/apply", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ reason, fromDate, toDate })
    });
    
    if(res.ok) {
      setReason(""); setFromDate(""); setToDate("");
      loadLeaves();
      alert("Leave applied successfully!");
    } else {
      const err = await res.json();
      alert(err.message);
    }
  };

  const deleteLeave = async (id) => {
    if(!window.confirm("Delete this request?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/delete/${id}`, { 
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    loadLeaves();
  };

  const styles = {
    container: { padding: "40px", fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f0f2f5", minHeight: "100vh" },
    header: { display: "flex", justifyContent: "space-between", marginBottom: "30px" },
    formCard: { backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", marginBottom: "40px" },
    input: { padding: "12px", marginRight: "10px", borderRadius: "6px", border: "1px solid #ddd", width: "200px" },
    submitBtn: { padding: "12px 25px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    tableCard: { backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", overflow: "hidden" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={{ margin: 0, color: "#2c3e50" }}>Welcome, {userName}</h1>
          <p style={{ color: "#7f8c8d" }}>Roll Number: {rollNo}</p>
        </div>
        <button onClick={() => { localStorage.clear(); navigate("/"); }} style={{ height: "40px", padding: "0 20px", borderRadius: "6px", cursor: "pointer", border: "1px solid #ddd" }}>Logout</button>
      </div>

      <div style={styles.formCard}>
        <h3 style={{ marginTop: 0, color: "#34495e" }}>Apply for New Leave</h3>
        <form onSubmit={applyLeave} style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <input placeholder="Reason for leave" value={reason} onChange={e => setReason(e.target.value)} style={{ ...styles.input, flex: 2 }} required />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label>From:</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={styles.input} required />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label>To:</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={styles.input} required />
          </div>
          <button type="submit" style={styles.submitBtn}>Submit Application</button>
        </form>
      </div>

      <div style={styles.tableCard}>
        <table width="100%" cellPadding="15" style={{ borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #eee" }}>
              <th>Reason</th><th>From Date</th><th>To Date</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l._id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{l.reason}</td>
                <td>{new Date(l.fromDate).toLocaleDateString()}</td>
                <td>{new Date(l.toDate).toLocaleDateString()}</td>
                <td>
                  <span style={{ 
                    padding: "5px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold",
                    backgroundColor: l.status === "Approved" ? "#e8f5e9" : l.status === "Rejected" ? "#ffebee" : "#fff3e0",
                    color: l.status === "Approved" ? "#2e7d32" : l.status === "Rejected" ? "#c62828" : "#ef6c00"
                  }}>
                    {l.status}
                  </span>
                </td>
                <td>
                  {l.status === "Pending" ? (
                    <button onClick={() => deleteLeave(l._id)} style={{ color: "#c62828", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Cancel Request</button>
                  ) : <span style={{ color: "#bdc3c7" }}>No Actions</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}