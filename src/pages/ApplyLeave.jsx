import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function ApplyLeave() {
  const [form, setForm] = useState({
    studentName: "",
    rollNo: "",
    batchYear: "",
    mobileNumber: "",
    reason: "",
    numberOfDays: "",
    fromDate: "",
    toDate: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitLeave = async () => {
    try {
      await axios.post("http://localhost:5000/api/leaves/apply", form);
      alert("Leave submitted successfully");
      setForm({
        studentName: "",
        rollNo: "",
        batchYear: "",
        mobileNumber: "",
        reason: "",
        numberOfDays: "",
        fromDate: "",
        toDate: ""
      });
    } catch {
      alert("Error submitting leave");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>EEE Leave Application</h2>

        <input name="studentName" placeholder="Student Name" value={form.studentName} onChange={handleChange} />
        <input name="rollNo" placeholder="Roll Number" value={form.rollNo} onChange={handleChange} />
        <input name="batchYear" placeholder="Batch Year" value={form.batchYear} onChange={handleChange} />
        <input name="mobileNumber" placeholder="Mobile Number" value={form.mobileNumber} onChange={handleChange} />
        <input name="reason" placeholder="Reason" value={form.reason} onChange={handleChange} />
        <input name="numberOfDays" type="number" placeholder="Number of Days" value={form.numberOfDays} onChange={handleChange} />
        <input name="fromDate" type="date" value={form.fromDate} onChange={handleChange} />
        <input name="toDate" type="date" value={form.toDate} onChange={handleChange} />

        <button onClick={submitLeave}>Submit Leave</button>
      </div>
    </>
  );
}

export default ApplyLeave;
