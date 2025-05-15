import React, { useState, useEffect, use } from "react";
import { Layout, Descriptions, Spin, message, Button, Card, Divider, Table, Row, Col, Image } from "antd";
import { useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import "../styles/Pets.css";

const { Content } = Layout;

function Pets() {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vaccination, setVaccinations] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchPetDetails();
    fetchVaccinations();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/pets/${id}`);
      setPet(response.data[0]);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching pet details");
      setLoading(false);
    }
  };

  const fetchVaccinations = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/pets/vaccinations/${id}`);
      console.log("Vaccination details:", response.data);
      setVaccinations(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching vaccination details");
      setLoading(false);
    }
  };

  const vaccineColumns = [
    { title: "ID", dataIndex: "history_id", key: "history_id" },
    { title: "Vaccine Name", dataIndex: "vaccine_name", key: "vaccine_name" },
    { title: "Date Given", dataIndex: "date_administered", key: "date_administered", render: (date) => date ? dayjs(date).format('MMMM D, YYYY') : '', },
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
        <Card style={{ border: "none", height: '330px' }}>
          <Row gutter={[30, 20]}>
            <Col flex="400px">
              <Image
                src={pet.pet_img || "https://archive.org/download/placeholder-image//placeholder-image.jpg"}
                alt={pet.pet_name}
                style={{ width: 380, height: 280, objectFit: "cover", borderRadius: 8 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://archive.org/download/placeholder-image//placeholder-image.jpg";
                }}
              />
            </Col>
            <Col flex="auto">
              <Descriptions
                title="Pet Information"
                bordered
                column={1}
                size="middle"
                style={{ height: "100%" }}
              >
                <Descriptions.Item label="Pet ID">{pet.pet_id}</Descriptions.Item>
                <Descriptions.Item label="Name">{pet.pet_name}</Descriptions.Item>
                <Descriptions.Item label="Sex">{pet.pet_sex}</Descriptions.Item>
                <Descriptions.Item label="Species">{pet.pet_species}</Descriptions.Item>
                <Descriptions.Item label="Owner">{pet.owner_name}</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>

        <Divider orientation="left" style={{ marginTop: 50 }}>
          Vaccine History
        </Divider>

        <Table
          bordered
          columns={vaccineColumns}
          dataSource={vaccination}
          rowKey={(record) => record.history_id}
          pagination={{ pageSize: 5 }}
          style={{ marginTop: 20 }}
        />
      </Content>
    </Layout>
  );
}

export default Pets;
