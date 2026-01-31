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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

  // NEW: DELETE LOGIC FOR STUDENT
  const deleteLeave = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pending leave?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Leave deleted successfully!");
        loadLeaves();
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Welcome, {userName} ({rollNo})</h2>
        <button onClick={() => { localStorage.clear(); navigate("/"); }}>Logout</button>
      </div>

      <div style={{ border: "1px solid #ddd", padding: "20px", margin: "20px 0" }}>
        <h3>Apply for Leave</h3>
        <form onSubmit={applyLeave}>
          <input type="text" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} required />
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
          <button type="submit">Submit</button>
        </form>
      </div>

      <h3>My History</h3>
      <table border="1" width="100%">
        <thead><tr><th>Reason</th><th>From</th><th>To</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l._id}>
              <td>{l.reason}</td>
              <td>{new Date(l.fromDate).toLocaleDateString()}</td>
              <td>{new Date(l.toDate).toLocaleDateString()}</td>
              <td>{l.status}</td>
              <td>
                {l.status === "Pending" && (
                  <button onClick={() => deleteLeave(l._id)} style={{ color: "red" }}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default StudentDashboard;