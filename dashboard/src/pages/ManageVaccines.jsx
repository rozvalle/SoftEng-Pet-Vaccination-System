import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Button, Table, Modal, Form, Input, message, Popconfirm, Divider } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import '../styles/ManageVaccines.css'; // Adjust the path as necessary

const { Content } = Layout;

function ManageVaccines() {
    const [vaccine, setVaccine] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [filteredVaccines, setFilteredVaccines] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVaccine, setEditingVaccine] = useState(null);
    const [form] = Form.useForm();

    const columns = [
      {
        title: 'ID',
        dataIndex: 'vaccine_id',
        key: 'vaccine_id',
        width: 40,
      },
      {
        title: 'Name',
        dataIndex: 'vaccine_name',
        key: 'vaccine_name',
        width: 220,
        ellipsis: true,
      },
      {
        title: 'Description',
        dataIndex: 'vaccine_desc',
        key: 'vaccine_desc',
        width: 500,
        ellipsis: true,
      },
      {
        title: 'Manufacturer',
        dataIndex: 'vaccine_man',
        key: 'vaccine_man',
        width: 200,
        ellipsis: true,
      },
      {
        title: '',
        key: 'actions',
        width: 130,
        render: (_, record) => (
          <div style={{ display: "flex", justifyContent: "space-between", width: "180px", paddingRight: "20px" }}>
            <Button
              icon={<InfoCircleOutlined />}
              style={{ marginRight: 8, width: "60px" }}
              onClick={() => { `https://localhost:5000/vaccines/${record.vaccine_id}` 
              }}
            />
            <Button
              icon={<EditOutlined />}
              style={{ marginRight: 8, width: "60px" }}
              onClick={() => {
                fetchVaccineById(record.vaccine_id);  // Fetch vaccine data
                setEditingVaccine(record);  // Set the record for later use
                form.setFieldsValue({
                  name: record.vaccine_name,  // Use record here, not vaccine directly
                  description: record.vaccine_desc,
                  manufacturer: record.vaccine_man,
                  imgurl: record.vaccine_img,
                });
                setIsModalOpen(true);
              }}
            />
            <Popconfirm
              title="Are you sure you want to delete this Vaccine?"
              onConfirm={() => handleDelete(record.vaccine_id)}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button icon={<DeleteOutlined />} danger style={{ width: "60px" }} />
            </Popconfirm>
          </div>
        )
      }
    ];

    useEffect(() => {
      fetchVaccines();
    }, []);
  
    const fetchVaccines = async () => {
      try {
        const response = await axios.get("http://localhost:5000/vaccines");
        setVaccines(response.data);
        setFilteredVaccines(response.data);
      } catch (error) {
        message.error("Error fetching vaccines");
      }
    };

    const fetchVaccineById = async (id) => {
      try {
        const response = await axios.get("http://localhost:5000/vaccines/" + id);
        if (response.data && response.data.length > 0) {
          const vaccineData = response.data[0]; // Get the first item from the array
          console.log('Fetched vaccine data:', vaccineData);
          setVaccine(vaccineData);  // Set the vaccine object
        } else {
          console.error('No vaccine data found');
        }
      } catch (error) {
        message.error("Error fetching vaccine");
        console.error(error);
      }
    };

    const handleSubmit = async (values) => {
      try {
        const userData = {
          vaccine_name: values.name,
          vaccine_desc: values.description,
          vaccine_man: values.manufacturer,
          vaccine_img: values.imgurl,
        };
  
      let response;
      if (editingVaccine) {
        response = await axios.put(
          `http://localhost:5000/users/${editingVaccine.user_id}`,
          userData
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/vaccines",
          userData
        );
    }       console.log("Server Response:", response.data);
          message.success(response.data.message || "Vaccine saved successfully");
    
          await fetchVaccines();
          setIsModalOpen(false);
          form.resetFields();
        } catch (error) {
          console.error("Error saving vaccine:", error);
          message.error(error.response?.data?.error || "Error saving vaccine");
        }
      };
  
 
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout style={{ background: "#fefefe", padding: 0, }}>
        <Content style={{ 
          overflow: "hidden",
          padding: 35 }}>
          <h1 className="h1-user">Vaccine Management</h1>
          <p>Manage vaccine, and control access efficiently.</p>
          <Divider style={{borderColor: "#ddd" }} />
           <div className="table-top-parent-vaccine">
            <div className="header-user">
              <Input.Search
                placeholder="Search vaccine..."
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
                  height: "35px",
                  backgroundColor: "#001529",
                  borderColor: "#001529"
                }}
                onClick={() => {
                  setEditingVaccine(null);
                  form.resetFields();
                  setIsModalOpen(true);
                }}
              >
                Add Vaccine
              </Button>
            </div>
          </div>
            <Layout style={{ backgroundColor: '#fefefe', borderRadius: 10 }} >
                <Table 
                    columns={columns} 
                    dataSource={filteredVaccines}
                    size="normal"
                    bordered
                    pagination={{ pageSize: 5 }}
                />
            </Layout>
        </Content>

        <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={450}>
        <h2 style={{ marginBottom: "16px", textAlign:'center' }}>
          {editingVaccine ? "Edit Vaccine" : "Add Vaccine"}
        </h2>
        <p style={{textAlign:'center'}}>A pop-up form to quickly add new vaccine details.</p>
        
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleSubmit}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          labelAlign="left"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
            style={{ marginBottom: "12px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
            style={{ marginBottom: "12px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="manufacturer"
            label="Manufacturer"
            style={{ marginBottom: "12px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="imgurl"
            label="Image URL"
            rules={[{ required: true }]}
            style={{ marginBottom: "12px" }}
          >
            <Input />
          </Form.Item>
          
          <Form.Item wrapperCol={{ span: 24 }} style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ backgroundColor: "#001529", borderColor: "#001529" }}
            >
              {editingVaccine ? "Update" : "Add"} User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      </Layout>
    </Layout>
  );
}

export default ManageVaccines;
