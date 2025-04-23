import { Layout, Card, Row, Typography, Divider, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { 
  HeartOutlined, 
  PlusCircleOutlined, 
  MedicineBoxOutlined,
  AppstoreAddOutlined,
  SmileOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import React from "react";
import "../styles/Dashboard.css";

const { Title, Text } = Typography;

export default function Dashboard() {
  const navigate = useNavigate();
  const cardData = [
    {
      icon: <AppstoreAddOutlined style={{ fontSize: '55px', color: '#ff4d4f' }} />,
      title: 'Total Pets Registered',
      description: '120 Pets', // Example data, replace with dynamic data
    },
    {
      icon: <MedicineBoxOutlined style={{ fontSize: '60px', color: '#52c41a' }} />,
      title: 'Total Vaccines Administered',
      description: '250 Vaccines', // Example data, replace with dynamic data
    },
  ];

  const features = [
    { 
      title: "Manage Pets", 
      description: "View and update pet records and details.", 
      icon: <HeartOutlined />, 
      path: "/managepets",
      gradient: "linear-gradient(135deg, #ff6f61 0%, #de483f 100%)"
    },
    { 
      title: "Add Species", 
      description: "Register new pet species in the database.", 
      icon: <PlusCircleOutlined />, 
      path: "/addspecies",
      gradient: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)"
    },
    { 
      title: "Add Breed", 
      description: "Define breeds for each pet species.", 
      icon: <PlusCircleOutlined />, 
      path: "/addbreed",
      gradient: "linear-gradient(135deg, #cc2b5e 0%, #753a88 100%)"
    },
    { 
      title: "Add Vaccine", 
      description: "Register vaccines for pet health records.", 
      icon: <MedicineBoxOutlined />, 
      path: "/vaccines",
      gradient: "linear-gradient(135deg, #ff9a44 0%, #fc6076 100%)"
    },
  ];

  return (
    <Layout style={{ backgroundColor: "#fff", gap: "0px", }}>
      <Layout style={{ padding: "35px", gap: "0px", backgroundColor: "#fff", marginBottom:0}}>
      <Card
      style={{
        height: "20vh",
        backgroundColor: "#FAF3E0",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <SmileOutlined style={{ fontSize: "32px", color: "#001529" }} />
        <div>
          <Title level={2} style={{ margin: 0 }}>Welcome to FurCare Dashboard</Title>
          <Text type="secondary">Today is {dayjs().format('MMMM D, YYYY')}</Text>
        </div>
      </div>
    </Card>
      <div className="dashboard-parent">
        <div style={{ width: "3px", height: "50px", backgroundColor: "#f0f0f0", margin: "0 8px" }} />
        <div className="dashboard-child">
          <p style={{marginBottom:"-10px", marginTop:'1px'}}>Total Pets:</p>
          <p><b>15</b></p>
        </div>
        <div style={{ width: "3px", height: "50px", backgroundColor: "#f0f0f0", margin: "0 8px" }} />
        <div className="dashboard-child">
          <p style={{marginBottom:"-10px", marginTop:'1px'}}>Total Vaccines Administered:</p>
          <p><b>15</b></p>
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
