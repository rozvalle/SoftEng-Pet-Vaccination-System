import React, { useState, useEffect } from "react";
import { Layout, Descriptions, Spin, message, Button, Card, Divider, Table } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import "../styles/Pets.css"; // Adjust the path as necessary

const { Content } = Layout;

function Pets() {
  const [pet, setPet] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPetDetails();
    fetchPetVaccines();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
        console.log("Fetching pet details for ID:", id); // Log the petId being fetched
      const response = await axios.get(`http://localhost:5000/pets/${id}`);
      setPet(response.data[0]);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching pet details");
      setLoading(false);
    }
  };

  const fetchPetVaccines = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/vaccinehistory/pet/${petId}`);
      setVaccines(response.data);
    } catch (error) {
      message.error("Error fetching vaccine history");
    }
  };

  const vaccineColumns = [
    { title: "Vaccine Name", dataIndex: "vaccine_name", key: "vaccine_name" },
    { title: "Date Given", dataIndex: "date_given", key: "date_given" },
  ];

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!pet) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: 35, textAlign: "center" }}>
          <h2>Pet not found</h2>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: 35 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            href="/pets"
            style={{ marginBottom: "20px" }}
          >
            Back to Pets List
          </Button>

        <Card>
            <h3 style={{ padding: 0, marginTop: 0}}>Pet Details</h3>
            <div className="pet-details">
                <div className='pet-details-image' style={{ flex: "0 0 250px" }}>
                <img
                    src={pet.pet_img || "https://archive.org/download/placeholder-image//placeholder-image.jpg"}
                    alt={pet.pet_name}
                    style={{ width: 350, height: 250, objectFit: "cover", borderRadius: 8 }}
                    onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://archive.org/download/placeholder-image//placeholder-image.jpg";
                    }}
                />
                </div>
                <div style={{ alignItems: "center", display: "flex", paddingLeft: 20 }}>
                <Descriptions column={1}>
                    <Descriptions.Item label="Pet ID">{pet.pet_id}</Descriptions.Item>
                    <Descriptions.Item label="Name">{pet.pet_name}</Descriptions.Item>
                    <Descriptions.Item label="Sex">{pet.pet_sex}</Descriptions.Item>
                    <Descriptions.Item label="Species">{pet.pet_species}</Descriptions.Item>
                    <Descriptions.Item label="Owner">{pet.owner_name}</Descriptions.Item>
                </Descriptions>
                </div>
            </div>
        </Card>

        <Divider orientation="left" style={{ marginTop: 50 }}>
          Vaccine History
        </Divider>

        <Table
          bordered
          columns={vaccineColumns}
          dataSource={vaccines}
          rowKey={(record) => record.history_id}
          pagination={{ pageSize: 5 }}
          style={{ marginTop: 20 }}
        />
      </Content>
    </Layout>
  );
}

export default Pets;
