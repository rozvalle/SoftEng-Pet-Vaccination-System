import { Layout, Card, Row, Typography, Button, Avatar} from "antd";
import { useNavigate } from "react-router-dom";
import { 
  HeartOutlined, 
  MedicineBoxOutlined,
  UserOutlined,
  SmileOutlined,
  FileTextOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import "../styles/Dashboard.css";
import axios from "axios";

const { Title, Text } = Typography;

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardCounts, setDashboardCounts] = useState({
    userCount: 0,
    petCount: 0,
    vaccineHistoryCount: 0,
  });

  useEffect(() => {
    fetchDashboardCounts();
  }, []);
  
const fetchDashboardCounts = async () => {
  try {
    const response = await axios.get('http://localhost:5000/dashboard/counts');
    console.log("Dashboard Counts:", response.data); // Log the response data
    setDashboardCounts({
      userCount: response.data.user_count,
      petCount: response.data.pet_count,
      vaccineHistoryCount: response.data.vaccinehistory_count,
    });

    console.log(response.data);
  } catch (error) {
    console.error('Failed to fetch dashboard counts:', error);
    throw error;
  }
};

  const features = [
    { 
      title: "Manage Pets", 
      description: "View and update pet records and details.", 
      icon: <HeartOutlined />, 
      path: "/pets",
      gradient: "linear-gradient(135deg, #00a8ac 0%, #005974 100%)"
    },
    { 
      title: "Manage User", 
      description: "Register, and manage users in the database.", 
      icon: <UserOutlined />, 
      path: "/users",
      gradient: "linear-gradient(135deg, #75fac7 0%, #00a8ac 100%)"
    },
    { 
      title: "Manage Records", 
      description: "Define breeds for each pet species.", 
      icon: <FileTextOutlined />, 
      path: "/vaccines/records",
      gradient: "linear-gradient(135deg, #005974 0%, #001529 100%)"
    },
    { 
      title: "Manage Vaccines", 
      description: "Register vaccines for pet health records.", 
      icon: <MedicineBoxOutlined />, 
      path: "/vaccines",
      gradient: "linear-gradient(135deg, #ff9a44 0%, #fc6076 100%)"
    },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("username");
  };

  return (
    <Layout style={{ backgroundColor: "#fefefe", gap: "0px" }}>
      <Layout className="dashboard-profile" style={{ padding: "10px 20px 10px 20px", backgroundColor: "#fefefe" }}>
        <Text type="secondary" style={{ color: "#000", fontWeight: 600, fontSize: "14px"}}>
          {dayjs().format('MMMM D, YYYY')} {dayjs().format('HH:mm')}
        </Text>
        <div className="dashboard-profile-user">
          <Avatar shape="square" size="large" icon={<UserOutlined />} />
          <div className="dashboard-profile-text">
            <Text style={{ marginLeft: "10px", fontSize: "14px", fontWeight: 600 }}>
              {sessionStorage.getItem("username")}
            </Text>
            <Text style={{ marginLeft: "10px", fontSize: "12px", color: "#000" }} type="secondary">
              <a href="/login" onClick={ handleLogout }>Logout</a>
            </Text>
          </div>
        </div>
      </Layout>
      <Layout style={{ padding: "0 15px", backgroundColor: "#fefefe" }}>
        <Card
          className="dashboard-card"
          style={{
            height: "250px",
            backgroundColor: '#005974',
            borderRadius: "16px",
            display: "flex",
            backgroundSize: "cover",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ paddingLeft: 15 }}>
              <Title level={2} style={{ margin: 0, color: "#fff" }}>Welcome to FurCare</Title>
              <p>Easily manage your pets' health, track their vaccination records, and stay on top of appointments—all in one place.</p>
              <Button
                type="default"
                icon={<CompassOutlined />}
                style={{ marginTop: 16 }}
              >
                Explore Features
              </Button>
            </div>
          </div>
        </Card>
      </Layout>
      <Layout style={{ padding: "0 20px 20px 20px", backgroundColor: "#fff", marginBottom: 0 }}>
        <div className="dashboard-parent">
          <div style={{ width: "3px", height: "50px", backgroundColor: "#f0f0f0", margin: "0 8px" }} />
          <div className="dashboard-child">
            <p style={{ marginBottom: "-10px", marginTop: '1px' }}>Total User</p>
            <p><b>{dashboardCounts.userCount}</b></p>
          </div>
          <div style={{ width: "3px", height: "50px", backgroundColor: "#f0f0f0", margin: "0 8px" }} />
          <div className="dashboard-child">
            <p style={{ marginBottom: "-10px", marginTop: '1px' }}>Total Pets</p>
            <p><b>{dashboardCounts.petCount}</b></p>
          </div>
          <div style={{ width: "3px", height: "50px", backgroundColor: "#f0f0f0", margin: "0 8px" }} />
          <div className="dashboard-child">
            <p style={{ marginBottom: "-10px", marginTop: '1px' }}>Total Vaccines Administered</p>
            <p><b>{dashboardCounts.vaccineHistoryCount}</b></p>
          </div>
        </div>

        <h2>Quick Access</h2>
        <Row justify="left" style={{ gap: "10px" }}>
          {features.map((feature, index) => (
            <Card
              hoverable
              className="feature-card"
              style={{
                textAlign: "left",
                borderRadius: "10px",
                border: "none",
                background: feature.gradient,
                color: "white",
                width: "250px",
                height: "200px",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background 0.3s",
              }}
              onClick={() => navigate(feature.path)}
            >
              {React.cloneElement(feature.icon, {
                style: { fontSize: "55px", color: "white", marginBottom: "15px" }
              })}
              <Title level={4} style={{ margin: 0, color: "white", fontWeight: "600" }}>
                {feature.title}
              </Title>
              <Text style={{ color: "white", opacity: 0.9 }}>{feature.description}</Text>
            </Card>
          ))}
        </Row>
      </Layout>
    </Layout>
  );
}
