import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Button, Table, Modal, Form, Input, message, Popconfirm, Divider } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import '../styles/ManageVaccines.css'; // Adjust the path as necessary

const { Content } = Layout;

function ManageVaccines() {
    const columns = [
        {
          title: 'Vaccine ID',
          dataIndex: 'vaccineId',
          key: 'vaccineId',
        },
        {
          title: 'Vaccine Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'Manufacturer',
          dataIndex: 'manufacturer',
          key: 'manufacturer',
        },
      ];

      const data = [
        {
          key: 1,
          vaccineId: 101,
          name: 'Rabies',
          description: 'Protects against rabies virus',
          manufacturer: 'PetMed Inc.',
        },
        {
          key: 2,
          vaccineId: 102,
          name: 'Distemper',
          description: 'Prevents canine distemper',
          manufacturer: 'VetCare Labs',
        },
      ];
 
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout style={{ background: "#fefefe", padding: 0, }}>
        <Content style={{ 
          overflow: "hidden",
          padding: 35 }}>
          <h1 className="h1-user">Vaccine Management</h1>
          <p>Manage vaccine, and control access efficiently.</p>
          <Divider style={{borderColor: "#ddd" }} />
            <Layout style={{ backgroundColor: '#fefefe', borderRadius: 10 }} >
                <Table 
                    columns={columns} 
                    dataSource={data}
                    size="normal"
                    bordered
                />
            </Layout>
        </Content>
      </Layout>
    </Layout>
  );
}

export default ManageVaccines;
