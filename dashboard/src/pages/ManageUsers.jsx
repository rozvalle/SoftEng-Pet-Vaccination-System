import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Button, Table, Modal, Form, Input, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Content } = Layout;

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
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
      title: "Actions",
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
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Content style={{ padding: "24px", background: "#fff" }}>
        <h2>Manage Users</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingUser(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add User
        </Button>
        <Table
          bordered
          columns={columns}
          dataSource={users}
          rowKey="user_id"
          style={{ marginTop: 20 }}
          pagination={{ pageSize: 5 }}
        />
      </Content>

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="firstname" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastname" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="middlename" label="Middle Name">
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {editingUser ? "Update" : "Add"} User
          </Button>
        </Form>
      </Modal>
    </Layout>
  );
}

export default ManageUsers;
