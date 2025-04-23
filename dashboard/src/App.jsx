import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Main from "./pages/MainLayout";  // ✅ Import Main correctly
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import Login from "./pages/Login";
import ManageVaccines from "./pages/ManageVaccines";

const PrivateRoute = () => {
  const token = sessionStorage.getItem("isAuthenticated");

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Main />}> {/* ✅ Main Layout with Sidebar */}
            <Route index element={<Dashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="vaccines" element={<ManageVaccines />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}