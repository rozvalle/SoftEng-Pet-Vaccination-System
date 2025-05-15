import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Descriptions, Spin, message, Button, Table, Card, Row, Col, Divider } from "antd";
import { useParams } from "react-router-dom"; // If using React Router for dynamic routing
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Content } = Layout;

function Users() {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchUserPets = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/pets/owner/${id}`);
      console.log("User Pets:", response.data);
      setPets(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching pet details");
      setLoading(false);
    }
  };

  const fetchVaccinations = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/details/vaccinations/${id}`);
      console.log("Vaccination details:", response.data);
      setVaccinations(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching vaccination details");
      setLoading(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "history_id", key: "history_id" },
    { title: "Vaccine Name", dataIndex: "vaccine_name", key: "vaccine_name" },
    { title: "Pet Name", dataIndex: "pet_name", key: "pet_name" },
    { title: "Date Administered", dataIndex: "date_administered", key: "date_administered", render: (date) => date ? dayjs(date).format('MMMM D, YYYY') : '', },
  ]

  useEffect(() => {
    fetchUserDetails();
    fetchUserPets();
    fetchVaccinations();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${id}`);
      setUser(response.data[0]);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching user details");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#fefefe" }}>
        <Content style={{ padding: 35, textAlign: "center" }}>
          <h2>User not found</h2>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout style={{ background: "#fbfbfb", padding: 0 }}>
        <Content style={{ padding: 35 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            href="/users"
            style={{ marginBottom: "20px" }}
          >
            Back to Users List
          </Button>

          {loading ? (
            <div style={{ textAlign: "center", marginTop: 50 }}>
              <Spin size="large" />
              <p>Loading user details...</p>
            </div>
          ) : (
            <>
              <Card title="User Information" style={{ marginBottom: 30 }}>
                <Descriptions layout="vertical" column={3}>
                  <Descriptions.Item label="User ID">{user.user_id}</Descriptions.Item>
                  <Descriptions.Item label="First Name">{user.user_fn}</Descriptions.Item>
                  <Descriptions.Item label="Middle Name">{user.user_mn}</Descriptions.Item>
                  <Descriptions.Item label="Last Name">{user.user_ln}</Descriptions.Item>
                  <Descriptions.Item label="Username">{user.user_name}</Descriptions.Item>
                </Descriptions>
              </Card>

              <Divider orientation="left" style={{ marginTop: 50 }}>Pets Owned</Divider>
              {pets.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <img
                    src="https://archive.org/download/placeholder-image//placeholder-image.jpg"
                    alt="No pets"
                    style={{ width: 150, height: 150, objectFit: "cover", marginBottom: 10 }}
                  />
                  <p>No pets owned by this user.</p>
                </div>
              ) : (
                <Row gutter={[16, 16]}>
                  {pets.map((pet) => (
                    <Col xs={24} sm={12} md={8} lg={5} key={pet.pet_id}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt={pet.pet_name}
                            src={pet.pet_img || "https://archive.org/download/placeholder-image//placeholder-image.jpg"}
                            style={{ width: "100%", height: 200, objectFit: "cover" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://archive.org/download/placeholder-image//placeholder-image.jpg";
                            }}
                          />
                        }
                        actions={[
                          <Button
                            type="link"
                            onClick={() => {
                              message.info(`Viewing details for ${pet.pet_name}`);
                            }}
                            href={`/pets/${pet.pet_id}`}
                          >
                            View Info
                          </Button>,
                        ]}
                      >
                        <h3>{pet.pet_name}</h3>
                        <p><strong>Species:</strong> {pet.pet_species}</p>
                        <p><strong>Sex:</strong> {pet.pet_sex}</p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}

              <Divider orientation="left" style={{ marginTop: 50 }}>Vaccine History</Divider>
              <Table
                dataSource={vaccinations}
                columns={columns}
                //dataSource={filteredUsers}
                rowKey="id"
                style={{ marginTop: 20, overflow: "hidden", width: "100%" }}
                pagination={{ pageSize: 5 }}
                rowClassName={(index) =>
                  index % 2 === 0 ? "table-row-light" : "table-row-dark"
                }
              />
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default Users;
