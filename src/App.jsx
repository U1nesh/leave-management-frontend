import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelect from "./pages/RoleSelect";
import StudentLogin from "./pages/StudentLogin";
// Changed from AdminLogin to TeacherLogin to match your file name
import AdminLogin from "./pages/TeacherLogin"; 
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/student-login" element={<StudentLogin />} />
        {/* This path stays the same, but it now loads TeacherLogin.jsx */}
        <Route path="/admin-login" element={<AdminLogin />} /> 
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;