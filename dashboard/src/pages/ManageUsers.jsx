import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Button, Table, Modal, Form, Input, message, Popconfirm, Divider } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "../styles/ManageUsers.css"; // Adjust the path as necessary
import logo from "../assets/furcare.png"; // Adjust the path as necessary

const { Content } = Layout;

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setFilteredUsers(response.data);
      setUsers(response.data);
    } catch (error) {
      message.error("Error fetching users");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const userData = {
        user_fn: values.firstname,
        user_ln: values.lastname,
        user_mn: values.middlename,
        username: values.username,
        password: values.password
      };
  
      console.log("🟢 Sending update request with:", userData);
  
      let response;
      if (editingUser) {
        response = await axios.put(`http://localhost:5000/users/${editingUser.user_id}`, userData);
      } else {
        response = await axios.post("http://localhost:5000/users", userData);
      }
  
      console.log("🟢 Server Response:", response.data);
      message.success(response.data.message || "User saved successfully");
  
      await fetchUsers();
      setIsModalOpen(false); 
      form.resetFields(); 
    } catch (error) {
      console.error("❌ Error saving user:", error);
      message.error(error.response?.data?.error || "Error saving user");
    }
  };

  const handleDelete = async (user_id) => {
    if (!user_id) {
      console.error("Error: user_id is undefined");
      message.error("Cannot delete user: Missing user ID");
      return;
    }

    console.log(`Attempting to delete user with ID: ${user_id}`);
    await axios.delete(`http://localhost:5000/users/${user_id}`);
    message.success("User deleted successfully");
    fetchUsers();
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = users.filter(
      (user) =>
        user.user_fn.toLowerCase().includes(value.toLowerCase()) ||
        user.user_ln.toLowerCase().includes(value.toLowerCase()) ||
        user.user_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const columns = [
    { title: "ID", dataIndex: "user_id", key: "user_id" },
    { title: "First Name", dataIndex: "user_fn", key: "user_fn" },
    { title: "Last Name", dataIndex: "user_ln", key: "user_ln" },
    { title: "Middle Name", dataIndex: "user_mn", key: "user_mn" },
    { title: "Username", dataIndex: "user_name", key: "user_name" },
    {
      title: "Password",
      dataIndex: "user_password",
      key: "user_password",
      render: (user_password) => "•".repeat(user_password?.length),
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8, width: "50%" }}
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue({
                firstname: record.user_fn,
                lastname: record.user_ln,
                middlename: record.user_mn,
                username: record.user_name,
                password: record.user_password,
              });
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.user_id)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button icon={<DeleteOutlined />} danger style={{ width: "50%" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
     {/* <Layout className="page-header" style={{ 
           height: "80px", 
           minHeight: "80px",
           maxHeight: "80px",
           zIndex: 10,
           overflow: "hidden", background: "#fff", 
           //boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", 
           textAlign: "center",
        }}
      > 
        <Content>
          <img src={logo} style={{ height:"80px", marginLeft:"-50px" }} />
        </Content>
      </Layout>
      */}
      <Layout style={{ background: "#f4f4f4", padding: 0, }}>
        <Content style={{ 
          overflow: "hidden",
          padding: 35, background: "#fff", borderRadius: "6px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", }}>
          <h1 className="h1-user">User Management</h1>
          <p>Manage user accounts, update details, and control access efficiently.</p>
          <Divider style={{borderColor: "#ddd" }} />
          <div className="table-top-parent">
            <div className="header-user">
              <Input.Search
                placeholder="Search users..."
                onChange={(e) => handleSearch(e.target.value)}
                value={searchText}
                style={{ width: 300 }}
                allowClear
                />
            </div>
            <div className="table-top-search">
              <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{
                    height: "40px",
                    backgroundColor: "#001529", 
                    borderColor: "#001529"
                  }}
                  onClick={() => {
                    setEditingUser(null);
                    form.resetFields();
                    setIsModalOpen(true);
                  }}
                >
                  Add User
              </Button>
            </div>
          </div>
          <Table
            bordered
            columns={columns}
            dataSource={filteredUsers}
            rowKey="user_id"
            style={{
              marginTop: 20,
              overflow: "hidden",
            }}
            pagination={{ pageSize: 5 }}
            rowClassName={(index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
      </Content>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
      <h2 style={{ marginBottom: "16px" }}>
        {editingUser ? "Edit User" : "Add User"}
      </h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="firstname" label="First Name" rules={[{ required: true }]} style={{ marginBottom: "8px" }}>
            <Input />
          </Form.Item>
          <Form.Item name="lastname" label="Last Name" rules={[{ required: true }]} style={{ marginBottom: "8px" }}>
            <Input />
          </Form.Item>
          <Form.Item name="middlename" label="Middle Name" style={{ marginBottom: "8px" }}>
            <Input />
          </Form.Item>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]} style={{ marginBottom: "8px" }}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]} style={{ marginBottom: "8px" }}>
            <Input.Password />
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#001529", borderColor: "#001529" }}>
          {editingUser ? "Update" : "Add"} User
        </Button>
        </Form>
        </Modal>
      </Layout>
    </Layout>
  );
}

export default ManageUsers;
