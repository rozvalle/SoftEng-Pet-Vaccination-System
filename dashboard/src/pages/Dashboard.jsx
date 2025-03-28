import { Layout } from 'antd';
import Sidebar from './Sidebar';
import { useState } from 'react';

const { Content } = Layout;

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 250; // Adjust based on collapse state

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Pass collapsed state and setter to Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Ensure Content adjusts dynamically */}
      <Layout style={{
        marginLeft: siderWidth, 
        transition: 'margin-left 0.3s ease' // Smooth transition
      }}>
        <Content style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
          <h2>Dashboard Page</h2>
          <p>Welcome to the dashboard!</p>
        </Content>
      </Layout>
    </Layout>
  );
}