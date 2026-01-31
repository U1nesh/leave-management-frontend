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
    } catch (err) {
      console.error("Admin fetch error:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchAllLeaves();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // NEW: DELETE LOGIC FOR ADMIN
  const deleteLeave = async (id) => {
    if (!window.confirm("Admin: Permanently delete this record?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Record removed.");
        fetchAllLeaves();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Admin Dashboard</h2>
      <table border="1" width="100%">
        <thead><tr><th>Student</th><th>Roll No</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l._id}>
              <td>{l.studentId?.name}</td>
              <td>{l.rollNo}</td>
              <td>{l.reason}</td>
              <td>{l.status}</td>
              <td>
                {l.status === "Pending" && (
                  <>
                    <button onClick={() => updateStatus(l._id, "Approved")}>Approve</button>
                    <button onClick={() => updateStatus(l._id, "Rejected")}>Reject</button>
                  </>
                )}
                <button onClick={() => deleteLeave(l._id)} style={{ color: "red", marginLeft: "10px" }}>Delete Record</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AdminDashboard;