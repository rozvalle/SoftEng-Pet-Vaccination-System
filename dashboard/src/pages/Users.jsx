import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Descriptions, Spin, message, Button, Table, Card, Row, Col} from "antd";
import { useParams } from "react-router-dom"; // If using React Router for dynamic routing
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Content } = Layout;

function Users() {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchUserPets = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/pets/owner/${id}`);
      console.log("User Pets:", response.data);
      setPets(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching user details");
      setLoading(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "user_id", key: "id" },
    { title: "Vaccine Name", dataIndex: "user_fn", key: "user_fn" },
    { title: "Pet Name", dataIndex: "user_ln", key: "user_ln" },
  ]
  
  useEffect(() => {
    fetchUserDetails();
    fetchUserPets();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${id}`); // Replace with your actual API endpoint
      console.log("User Details:", response.data); // Log the response data
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
      <Layout style={{ background: "#fefefe", padding: 0 }}>
        <Content style={{ padding: 35 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            href="/users"
            style={{ marginBottom: "20px" }}
          >
            Back to Users List
          </Button>
          
          <h3>User Details</h3>
          <Descriptions layout="vertical">
            <Descriptions.Item label="User ID">{user.user_id}</Descriptions.Item>
            <Descriptions.Item label="First Name">{user.user_fn}</Descriptions.Item>
            <Descriptions.Item label="Middle Name">{user.user_ln}</Descriptions.Item>
            <Descriptions.Item label="Last Name">{user.user_mn}</Descriptions.Item>
            <Descriptions.Item label="Username">{user.user_name}</Descriptions.Item>
          </Descriptions>

          <h3>Owned Pets</h3>
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
                <Col xs={24} sm={12} md={8} lg={6} key={pet.pet_id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={pet.pet_name}
                        src={pet.pet_img || "https://archive.org/download/placeholder-image//placeholder-image.jpg"}
                        style={{ height: 200, objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://archive.org/download/placeholder-image//placeholder-image.jpg";
                        }}
                      />
                    }
                  >
                    <p><h3>{pet.pet_name}</h3></p>
                    <p><strong>ID:</strong> {pet.pet_id}</p>
                    <p><strong>Species:</strong> {pet.pet_species}</p>
                    <p><strong>Sex:</strong> {pet.pet_sex}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          
          <h3>Vaccine History</h3>
          <Table
            bordered
            columns={columns}
            //dataSource={filteredUsers}
            rowKey="id"
            style={{ marginTop: 20, overflow: "hidden", width: "100%" }}
            pagination={{ pageSize: 5 }}
            rowClassName={(index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Users;
