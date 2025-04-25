import { Layout, Card, Row, Typography, Divider, Col, Spin } from "antd";
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
import dashboardbg from "../assets/dashboardbg.png";
import "../styles/Dashboard.css";

const { Title, Text } = Typography;

export default function Dashboard() {
  const navigate = useNavigate();
  /*
  const [loading, setLoading] = useState(true);
  
    if (loading) {
      return (
        <Layout style={{ minHeight: "100vh" }}>
          <Content style={{ padding: 35, textAlign: "center" }}>
            <Spin size="large" />
          </Content>
        </Layout>
      );
    }
  */

  const features = [
    { 
      title: "Manage Pets", 
      description: "View and update pet records and details.", 
      icon: <HeartOutlined />, 
      path: "/managepets",
      gradient: "linear-gradient(135deg, #00a8ac 0%, #005974 100%)"
    },
    { 
      title: "Add Species", 
      description: "Register new pet species in the database.", 
      icon: <PlusCircleOutlined />, 
      path: "/addspecies",
      gradient: "linear-gradient(135deg, #75fac7 0%, #00a8ac 100%)"
    },
    { 
      title: "Add Breed", 
      description: "Define breeds for each pet species.", 
      icon: <PlusCircleOutlined />, 
      path: "/addbreed",
      gradient: "linear-gradient(135deg, #005974 0%, #001529 100%)"
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
    <Layout style={{ backgroundColor: "#fefefe", gap: "0px", }}>
      <Layout style={{ padding: 15, paddingBottom: 0,backgroundColor: "#fefefe"}}>
        <Card
          className="dashboard-card"
            style={{
              height: "200px",
              //backgroundColor: '#005974',
              backgroundImage: `url(${dashboardbg})`,
              borderRadius: "16px",
              display: "flex",
              backgroundSize: "cover",
              flexDirection: "column",
              justifyContent: "center",
              padding: "24px",
            }}
          >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", }}>
            <SmileOutlined style={{ fontSize: "50px", color: "#fff" }} />
            <div>
              <Title level={2} style={{ margin: 0, color: "#fff"  }}>Welcome to FurCare Dashboard</Title>
              <Text type="secondary" style={{ color:"#fff"}}>Today is {dayjs().format('MMMM D, YYYY')}</Text>
            </div>
          </div>
        </Card>
      </Layout>
      <Layout style={{ padding: "35px", paddingTop: 0, gap: "0px", backgroundColor: "#fff", marginBottom:0}}>
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
