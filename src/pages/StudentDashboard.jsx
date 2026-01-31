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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason, fromDate, toDate }),
      });
      if (res.ok) {
        alert("Leave applied successfully!");
        setReason(""); setFromDate(""); setToDate("");
        loadLeaves();
      }
    } catch (err) {
      console.error("Apply error:", err);
    }
  };

  const deleteLeave = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pending leave?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { loadLeaves(); }
    } catch (err) { console.error("Delete error:", err); }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h2 style={{ margin: 0, color: "#333" }}>Welcome, <span style={{ color: "#007bff" }}>{userName}</span> ({rollNo})</h2>
        <button onClick={() => { localStorage.clear(); navigate("/"); }} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Logout</button>
      </div>

      <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", margin: "30px 0" }}>
        <h3 style={{ marginTop: 0, borderBottom: "2px solid #eee", paddingBottom: "10px" }}>Apply for New Leave</h3>
        <form onSubmit={applyLeave} style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center", marginTop: "20px" }}>
          <input type="text" placeholder="Reason for Leave" value={reason} onChange={(e) => setReason(e.target.value)} required style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "5px", flex: "1", minWidth: "200px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontWeight: "bold" }}>From:</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontWeight: "bold" }}>To:</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }} />
          </div>
          <button type="submit" style={{ padding: "12px 25px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Submit Application</button>
        </form>
      </div>

      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <h3 style={{ marginTop: 0 }}>My Leave History</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "white", textAlign: "left" }}>
              <th style={{ padding: "15px" }}>Reason</th>
              <th style={{ padding: "15px" }}>From</th>
              <th style={{ padding: "15px" }}>To</th>
              <th style={{ padding: "15px" }}>Status</th>
              <th style={{ padding: "15px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "15px" }}>{l.reason}</td>
                <td style={{ padding: "15px" }}>{new Date(l.fromDate).toLocaleDateString()}</td>
                <td style={{ padding: "15px" }}>{new Date(l.toDate).toLocaleDateString()}</td>
                <td style={{ padding: "15px", fontWeight: "bold", color: l.status === "Approved" ? "#28a745" : l.status === "Rejected" ? "#dc3545" : "#ffc107" }}>{l.status}</td>
                <td style={{ padding: "15px" }}>
                  {l.status === "Pending" && (
                    <button onClick={() => deleteLeave(l._id)} style={{ padding: "6px 12px", backgroundColor: "transparent", color: "#dc3545", border: "1px solid #dc3545", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default StudentDashboard;