import { Layout, Menu, Card, Row, Col, Statistic, Table } from 'antd';
import { UserOutlined, BarChartOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Line } from "@ant-design/charts";
import { useState } from 'react';

const { Header, Content, Sider } = Layout;

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  const data = [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 50 },
    { month: 'Mar', value: 40 },
    { month: 'Apr', value: 60 },
    { month: 'May', value: 80 },
  ];

  const config = {
    data,
    xField: 'month',
    yField: 'value',
    smooth: true,
    lineStyle: { stroke: '#1890ff' },
  };

  const columns = [
    { title: 'User', dataIndex: 'user', key: 'user' },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  const recentActivities = [
    { key: 1, user: 'Admin', action: 'Added a new user', date: '2025-03-28' },
    { key: 2, user: 'JohnDoe', action: 'Updated profile', date: '2025-03-27' },
    { key: 3, user: 'JaneDoe', action: 'Deleted a student', date: '2025-03-26' },
  ];

  return (
      <Layout style={{ backgroundColor: '#fff' }}>
        <Header style={{ background: '#fff', padding: '0 20px', fontSize: '20px', fontWeight: 'bold' }}>Dashboard</Header>
        <Content style={{ background: '#fff', borderRadius: '10px' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic title="Total Users" value={120} prefix={<UserOutlined />} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Active Users" value={85} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Total Students" value={500} />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col span={12}>
              <Card title="System Performance">
                <Line {...config} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Recent Activities">
                <Table columns={columns} dataSource={recentActivities} pagination={false} />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
  );
}
