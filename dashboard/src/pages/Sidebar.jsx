import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { UserOutlined, HomeOutlined, SettingOutlined, LogoutOutlined, UnorderedListOutlined} from '@ant-design/icons';
import logo from '../assets/verstappen.png'; // Adjust the path as necessary

const { Sider } = Layout;


export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const selectedKey = location.pathname;

  const menuItems = [
    { key: "/", icon: <HomeOutlined />, label: <Link to="/">Dashboard</Link> },
    { key: "/profile", icon: <UserOutlined />, label: <Link to="/">Profile</Link> },
    { key: "/settings", icon: <SettingOutlined />, label: <Link to="/">Settings</Link> },
    { key: "/manageusers", icon: <UnorderedListOutlined />, label: <Link to="/manageusers">Manage Users</Link> },
    { key: "divider", type: "divider", 
      style: { 
        borderTop: "2px solid rgba(255, 255, 255, 0.2)", 
        margin: "12px 0"  
      }
    },
    { key: "5", icon: <LogoutOutlined />, label: <Link to="/login">Logout</Link>},
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={250}
      collapsedWidth={80}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
    >
      <div className="logo" style={{ height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: '75px', objectFit: 'cover' }} />
      </div>
      <Menu theme="dark" mode="inline" items={menuItems} selectedKeys={[selectedKey]} />
    </Sider>
  );
}