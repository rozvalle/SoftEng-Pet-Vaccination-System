import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Main from "./pages/MainLayout";  // ✅ Import Main correctly
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import Login from "./pages/Login";
import ManageVaccines from "./pages/ManageVaccines";
import ManagePets from "./pages/ManagePets";
import Users from "./pages/Users";
import Pets from "./pages/Pets";
import Vaccines from "./pages/Vaccines";
import Vaccinations from "./pages/ManageVaccinations";
import About from "./pages/About";
import Contact from "./pages/Contact";

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
            <Route path="pets" element={<ManagePets />} />
            <Route path="users/:id" element={<Users />} />
            <Route path="pets/:id" element={<Pets />} />
            <Route path="vaccines/:id" element={<Vaccines />} />
            <Route path="vaccinations" element={<Vaccinations />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}