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
      // FIXED: Backticks used for dynamic URL
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
      // FIXED: Backticks used for dynamic URL
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaves/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert(`Leave ${status} Successfully!`);
        fetchAllLeaves();
      }
    } catch (err) {
      console.error("Update Status Error:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Admin Dashboard - Leave Requests</h2>
      <table border="1" width="100%" style={{ marginTop: "20px", textAlign: "left", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: "10px" }}>Student Name</th>
            <th style={{ padding: "10px" }}>Roll No</th>
            <th style={{ padding: "10px" }}>Reason</th>
            <th style={{ padding: "10px" }}>Status</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id}>
              <td style={{ padding: "10px" }}>{leave.studentId?.name || "N/A"}</td>
              <td style={{ padding: "10px" }}>{leave.rollNo}</td>
              <td style={{ padding: "10px" }}>{leave.reason}</td>
              <td style={{ padding: "10px", fontWeight: "bold" }}>{leave.status}</td>
              <td style={{ padding: "10px" }}>
                {leave.status === "Pending" && (
                  <>
                    <button onClick={() => updateStatus(leave._id, "Approved")} style={{ backgroundColor: "green", color: "white", marginRight: "5px", cursor: "pointer" }}>Approve</button>
                    <button onClick={() => updateStatus(leave._id, "Rejected")} style={{ backgroundColor: "red", color: "white", cursor: "pointer" }}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;