import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { UserOutlined, HomeOutlined, SettingOutlined, LogoutOutlined, UnorderedListOutlined, DashboardOutlined } from "@ant-design/icons";
import logo from "../assets/verstappen.png"; // Adjust path if necessary

const { Sider } = Layout;

export default function Sidebar({ collapsed, setCollapsed }) { // ✅ Accept props
  const location = useLocation();
  const selectedKey = location.pathname;

  const toggleSidebar = (value) => {
    setCollapsed(value);
    sessionStorage.setItem("sidebarCollapsed", JSON.stringify(value));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("username");
  };

  const menuItems = [
    { key: "/home", icon: <HomeOutlined />, label: <Link to="/home">Home</Link> },
    { key: "/", icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
    { key: "/manageusers", icon: <UnorderedListOutlined />, label: <Link to="/manageusers">Manage Users</Link> },
    { key: "/profile", icon: <UserOutlined />, label: <Link to="/profile">Profile</Link> },
    { key: "/settings", icon: <SettingOutlined />, label: <Link to="/settings">Settings</Link> },
    { key: "divider", type: "divider", style: { borderTop: "2px solid rgba(255, 255, 255, 0.2)", margin: "12px 0" } },
    { key: "/login", icon: <LogoutOutlined />, label: <Link to="/login" onClick={handleLogout}>Logout</Link> },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleSidebar}
      width={300}
      collapsedWidth={80}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
      }}
    >
      <div className="logo" style={{ height: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src={logo} alt="Logo" style={{ width: collapsed ? "40px" : "75px", transition: "width 0.3s ease" }} />
      </div>
      <Menu theme="dark" mode="inline" items={menuItems} selectedKeys={[selectedKey]} />
    </Sider>
  );
}