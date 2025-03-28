import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/MainLayout";  // ✅ Import Main correctly
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import Login from "./pages/Login";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />}> {/* ✅ Main Layout with Sidebar */}
          <Route index element={<Dashboard />} />
          <Route path="manageusers" element={<ManageUsers />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}