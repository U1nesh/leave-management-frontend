import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/");
    fetchAllLeaves();
  }, []);

  const fetchAllLeaves = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLeaves(data);
    } catch (err) { console.error("Admin fetch error:", err); }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchAllLeaves();
    } catch (err) { console.error("Update error:", err); }
  };

  const deleteLeave = async (id) => {
    if (!window.confirm("Admin: Permanently delete this record?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchAllLeaves();
    } catch (err) { console.error("Delete error:", err); }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#2c3e50" }}>Admin Dashboard - <span style={{ color: "#e67e22" }}>Leave Requests</span></h2>
        <button onClick={() => { localStorage.clear(); navigate("/"); }} style={{ padding: "10px 20px", backgroundColor: "#34495e", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Logout</button>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#2c3e50", color: "white", textAlign: "left" }}>
              <th style={{ padding: "15px" }}>Student Name</th>
              <th style={{ padding: "15px" }}>Roll No</th>
              <th style={{ padding: "15px" }}>Reason</th>
              <th style={{ padding: "15px" }}>Status</th>
              <th style={{ padding: "15px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "15px", fontWeight: "500" }}>{l.studentId?.name || "N/A"}</td>
                <td style={{ padding: "15px" }}>{l.rollNo}</td>
                <td style={{ padding: "15px" }}>{l.reason}</td>
                <td style={{ padding: "15px", fontWeight: "bold", color: l.status === "Approved" ? "green" : l.status === "Rejected" ? "red" : "orange" }}>{l.status}</td>
                <td style={{ padding: "15px" }}>
                  {l.status === "Pending" && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => updateStatus(l._id, "Approved")} style={{ padding: "6px 12px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Approve</button>
                      <button onClick={() => updateStatus(l._id, "Rejected")} style={{ padding: "6px 12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Reject</button>
                    </div>
                  )}
                  <button onClick={() => deleteLeave(l._id)} style={{ marginTop: l.status === "Pending" ? "10px" : "0", padding: "6px 12px", backgroundColor: "transparent", color: "#666", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" }}>Delete Record</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default AdminDashboard;