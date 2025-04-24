import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Descriptions, Spin, message, Button, Table, Card, Row, Col} from "antd";
import { useParams } from "react-router-dom"; // If using React Router for dynamic routing
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Content } = Layout;

function Users() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const pets = [
    {
      pet_id: 1,
      pet_name: "Buddy",
      species: "Dog",
      pet_img: "https://i.chzbgr.com/full/9720477440/h5C4664F2"
    },
    {
      pet_id: 2,
      pet_name: "Mr. Fresh",
      species: "Cat",
      pet_img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvSt9J3zVFe2tABxsdz0-A1TToX7OCULhFzg&s"
    },
    {
      pet_id: 3,
      pet_name: "Charlie",
      species: "Parrot",
      pet_img: "https://placehold.co/400x200?text=Parrot"
    },
    {
      pet_id: 4,
      pet_name: "Max",
      species: "Rabbit",
      pet_img: "https://placehold.co/400x200?text=Rabbit"
    }
  ];

  const columns = [
    { title: "ID", dataIndex: "user_id", key: "id" },
    { title: "Vaccine Name", dataIndex: "user_fn", key: "user_fn" },
    { title: "Pet Name", dataIndex: "user_ln", key: "user_ln" },
  ]
  
  useEffect(() => {
    fetchUserDetails();
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
        <Content style={{ padding: 35, textAlign: "center" }}>
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
            onClick={() => window.history.back()}
            style={{ marginBottom: "20px" }}
          >
            Back to Users List
          </Button>
          
          <h3>User Details</h3>
          <Descriptions bordered>
            <Descriptions.Item label="User ID">{user.user_id}</Descriptions.Item>
            <Descriptions.Item label="First Name">{user.user_fn}</Descriptions.Item>
            <Descriptions.Item label="Middle Name">{user.user_ln}</Descriptions.Item>
            <Descriptions.Item label="Last Name">{user.user_mn}</Descriptions.Item>
            <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
          </Descriptions>

          <h3>Owned Pets</h3>
          <Row gutter={[16, 16]}>
            {pets.map((pet) => (
              <Col xs={24} sm={12} md={8} lg={6} key={pet.pet_id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={pet.pet_name}
                      src={pet.pet_img}
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                >
                  <p><h3>{pet.pet_name}</h3></p>
                  <p><strong>ID:</strong> {pet.pet_id}</p>
                  <p><strong>Species:</strong> {pet.species}</p>
                </Card>
              </Col>
            ))}
          </Row>
          
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
