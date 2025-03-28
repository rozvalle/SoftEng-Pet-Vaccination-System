import React, { useState } from "react";
import { Table, Input, Button, Popconfirm, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Search } = Input;

const ManageUsers = () => {
  const [searchText, setSearchText] = useState("");

  // Sample User Data
  const [users, setUsers] = useState([
    { key: "1", name: "Admin One", role: "Admin", email: "admin1@example.com" },
    { key: "2", name: "John Doe", role: "User", email: "john@example.com" },
    { key: "3", name: "Jane Smith", role: "Editor", email: "jane@example.com" },
    { key: "4", name: "Mark Brown", role: "User", email: "mark@example.com" },
  ]);

  // Filter users based on search input
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(searchText.toLowerCase())
  );

  // Delete User
  const handleDelete = (key) => {
    setUsers(users.filter((user) => user.key !== key));
  };

  // Antd Table Columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Role", dataIndex: "role", key: "role", sorter: (a, b) => a.role.localeCompare(b.role) },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="primary">Edit</Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.key)}>
            <Button icon={<DeleteOutlined />} type="danger">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Search
        placeholder="Search by name or role"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={(value) => setSearchText(value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table
        columns={columns}
        dataSource={filteredUsers}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default ManageUsers;