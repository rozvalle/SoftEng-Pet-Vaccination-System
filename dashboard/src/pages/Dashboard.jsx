import { Layout, Card, Row, Col, Typography, Carousel } from "antd";
import { useNavigate } from "react-router-dom";
import { 
  HeartOutlined, 
  PlusCircleOutlined, 
  MedicineBoxOutlined 
} from "@ant-design/icons";
import React from "react";
import "../styles/Dashboard.css"; // Adjust the path as necessary
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";

const { Title, Text } = Typography;

export default function Dashboard() {
  const navigate = useNavigate();
  const bannerImages = [
    banner1,
    banner2,
    banner3,
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
      path: "/addvaccine",
      gradient: "linear-gradient(135deg, #ff9a44 0%, #fc6076 100%)"
    },
  ];

  return (
    <Layout style={{ backgroundColor: "#fff", gap: "0px", }}>
     <Carousel autoplay effect="fade" style={{ marginBottom: "0px" }}>
        {[1, 2, 3].map((num) => (
          <div key={num}>
            <img 
              src={bannerImages[num - 1]} 
              alt={`Slide ${num}`} 
              style={{ width: "100%", height: "400px", objectFit: "cover"}} 
            />
          </div>
        ))}
      </Carousel>
      <Layout style={{ padding: "24px", gap: "0px", backgroundColor: "#fff" }}>
      <h1 className="dashboard-header">Dashboard</h1>
      <Row justify="center" gutter={[10, 30]}>
        {features.map((feature, index) => (
           <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6}>
            <Card
              hoverable
              className="feature-card"
              style={{
                textAlign: "left",
                borderRadius: "10px",
                width: "100%",
                background: feature.gradient,
                color: "white",
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
          </Col>
        ))}
      </Row>
      </Layout>
    </Layout>
  );
}
