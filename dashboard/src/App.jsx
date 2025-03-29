import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Main from "./pages/MainLayout";  // ✅ Import Main correctly
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import Login from "./pages/Login";

const PrivateRoute = () => {
  const token = localStorage.getItem("isAuthenticated");

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Main />}> {/* ✅ Main Layout with Sidebar */}
            <Route index element={<Dashboard />} />
            <Route path="manageusers" element={<ManageUsers />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}