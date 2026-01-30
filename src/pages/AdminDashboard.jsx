import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch all leaves from the backend
  const fetchLeaves = async () => {
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/leaves/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLeaves(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    }
  };

  // Update status (Approved/Rejected)
  const updateStatus = async (id, status) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchLeaves(); // Refresh list after update
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // DELETE function for Admin
  const deleteLeave = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this record?")) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        fetchLeaves(); // Refresh list after deletion
      } else {
        alert("Failed to delete record");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    if (!token) navigate("/"); // Redirect to login if no token
    fetchLeaves();
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#333" }}>Admin Dashboard</h2>
        <button 
          onClick={handleLogout} 
          style={{ padding: "8px 15px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <table border="0" cellPadding="15" width="100%" style={{ borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#343a40", color: "white" }}>
              <th>Roll No</th>
              <th>Reason</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length > 0 ? (
              leaves.map((l) => (
                <tr key={l._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td>{l.rollNo}</td>
                  <td>{l.reason}</td>
                  <td>{new Date(l.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(l.toDate).toLocaleDateString()}</td>
                  <td>
                    <span style={{ 
                      fontWeight: "bold", 
                      color: l.status === "Approved" ? "#28a745" : l.status === "Rejected" ? "#dc3545" : "#fd7e14" 
                    }}>
                      {l.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => updateStatus(l._id, "Approved")} style={{ marginRight: "5px", cursor: "pointer", backgroundColor: "#28a745", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}>Approve</button>
                    <button onClick={() => updateStatus(l._id, "Rejected")} style={{ marginRight: "5px", cursor: "pointer", backgroundColor: "#ffc107", border: "none", padding: "5px 10px", borderRadius: "4px" }}>Reject</button>
                    <button onClick={() => deleteLeave(l._id)} style={{ cursor: "pointer", backgroundColor: "#dc3545", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>No leave applications found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}