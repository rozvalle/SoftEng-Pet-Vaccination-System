import React, { useState, useEffect } from "react";
import { Layout, Descriptions, Spin, message, Button, Card, Divider } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import "../styles/Vaccines.css"; // Adjust path if needed

const { Content } = Layout;

function Vaccines() {
  const [vaccine, setVaccine] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVaccineDetails();
  }, [id]);

  const fetchVaccineDetails = async () => {
    try {
      console.log("Fetching vaccine details for ID:", id);
      const response = await axios.get(`http://localhost:5000/vaccines/${id}`);
      setVaccine(response.data[0]); // Your API returns array
      setLoading(false);
    } catch (error) {
      message.error("Error fetching vaccine details");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!vaccine) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: 35, textAlign: "center" }}>
          <h2>Vaccine not found</h2>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: 35 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/vaccines")}
          style={{ marginBottom: "20px" }}
        >
          Back to Vaccines List
        </Button>

        <Card>
          {/*<h1 style={{ padding: 0, marginTop: 0 }}>Vaccine Details</h1> */}
          <div className="vaccine-details">
            <div className='vaccine-details-image' style={{ flex: "0 0 40%", aspectRatio: "4/3" }}>
              <img
                src={vaccine.vaccine_img || "https://archive.org/download/placeholder-image//placeholder-image.jpg"}
                alt={vaccine.vaccine_name}
                style={{ width: "100%", objectFit: "cover", borderRadius: 8 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://archive.org/download/placeholder-image//placeholder-image.jpg";
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: 'column', paddingLeft: 20, width: "50%", justifyContent: "center" }}>
              <h2 style={{ textAlign: 'left', padding: 0 }}>{vaccine.vaccine_name}</h2>
              <Descriptions column={1}>
                <Descriptions.Item label="ID">{vaccine.vaccine_id}</Descriptions.Item>
                <Descriptions.Item label="Manufacturer">{vaccine.vaccine_man}</Descriptions.Item>
                <Descriptions.Item label="Description">{vaccine.vaccine_desc}</Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}

export default Vaccines;
