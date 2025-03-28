import React, { useState } from 'react';
import { Layout, Button, Table, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  const columns = [
    { title: 'UID', dataIndex: 'uidNumber', key: 'uidNumber' },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Middle Name', dataIndex: 'middleName', key: 'middleName' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<InfoCircleOutlined />} style={{ marginRight: 8 }} />
          <Button icon={<EditOutlined />} style={{ marginRight: 8 }} />
          <Button icon={<DeleteOutlined />} danger />
        </>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Layout style={{ ypadding: '24px', background: "#fff" }}>
        <Content>
          <h2>Manage Users</h2>
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Add User
          </Button>
          <Table bordered columns={columns} dataSource={users} rowKey='uidNumber' style={{ marginTop: 20, }} />
        </Content>
      </Layout>

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout='vertical'>
          <Form.Item name='uidNumber' label='UID Number' rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name='firstName' label='First Name' rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name='lastName' label='Last Name' rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name='middleName' label='Middle Name'> 
            <Input />
          </Form.Item>
          <Form.Item name='username' label='Username' rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name='password' label='Password' rules={[{ required: true }]}> 
            <Input.Password />
          </Form.Item>
          <Button type='primary' htmlType='submit' block>
            {editingUser ? 'Update' : 'Add'} User
          </Button>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ManageUsers;
