import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Button, Table, Modal, Form, Input, Upload, message, Popconfirm, Divider } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import '../styles/ManageVaccines.css'; // Adjust the path if necessary

const { Content } = Layout;

function ManageVaccines() {
  const [vaccine, setVaccine] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [filteredVaccines, setFilteredVaccines] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [form] = Form.useForm();
  const [imageBase64, setImageBase64] = useState(null);

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
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Manufacturer',
      dataIndex: 'vaccine_man',
      key: 'vaccine_man',
      width: 150,
      ellipsis: true,
    },
    {
      title: '',
      key: 'actions',
      width: 130,
      render: (_, record) => (
        <div style={{ display: "flex", width: "100%", justifyContent: "right" }}>
          <Button
            icon={<InfoCircleOutlined />}
            style={{ marginRight: 8, width: 60 }}
            onClick={() => { window.location.href = `http://localhost:5173/vaccines/${record.vaccine_id}` }}
          />
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8, width: 60 }}
            onClick={() => {
              fetchVaccineById(record.vaccine_id);
              setEditingVaccine(record);
              form.setFieldsValue({
                name: record.vaccine_name,
                description: record.vaccine_desc,
                manufacturer: record.vaccine_man,
              });
              setImageBase64(record.vaccine_img || null);
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
            <Button icon={<DeleteOutlined />} danger style={{ width: 60 }} />
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
        const vaccineData = response.data[0];
        setVaccine(vaccineData);
      } else {
        console.error('No vaccine data found');
      }
    } catch (error) {
      message.error("Error fetching vaccine");
    }
  };

  const handleSubmit = async (values) => {
    if (!imageBase64) {
      message.error("Please upload an image");
      return;
    }

    try {
      const userData = {
        vaccine_name: values.name,
        vaccine_desc: values.description,
        vaccine_man: values.manufacturer,
        vaccine_img: imageBase64,
      };

      let response;
      if (editingVaccine) {
        response = await axios.put(
          `http://localhost:5000/vaccines/${editingVaccine.vaccine_id}`,
          userData
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/vaccines",
          userData
        );
      }
      message.success(response.data.message || "Vaccine saved successfully");
      await fetchVaccines();
      setIsModalOpen(false);
      form.resetFields();
      setImageBase64(null);
    } catch (error) {
      console.error("Error saving vaccine:", error);
      message.error(error.response?.data?.error || "Error saving vaccine");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/vaccines/${id}`);
      message.success("Vaccine deleted successfully");
      fetchVaccines();
    } catch (error) {
      console.error("Error deleting vaccine:", error);
      message.error("Error deleting vaccine");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = vaccines.filter((vaccine) =>
      vaccine.vaccine_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredVaccines(filtered);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleBeforeUpload = async (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }
    const base64 = await getBase64(file);
    setImageBase64(base64);
    return false;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout style={{ background: "#fefefe", padding: 0 }}>
        <Content style={{ overflow: "hidden", padding: 35 }}>
          <h1 className="h1-user">Vaccine Management</h1>
          <p>Manages vaccine information such as name, manufacturer, and description</p>
          <Divider style={{ borderColor: "#ddd" }} />

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
                style={{ height: "35px", backgroundColor: "#001529", borderColor: "#001529" }}
                onClick={() => {
                  setEditingVaccine(null);
                  form.resetFields();
                  setImageBase64(null);
                  setIsModalOpen(true);
                }}
              >
                Add Vaccine
              </Button>
            </div>
          </div>

          <Layout style={{ backgroundColor: '#fefefe', borderRadius: 10 }}>
            <Table
              columns={columns}
              dataSource={filteredVaccines}
              size="normal"
              bordered
              pagination={{ pageSize: 5 }}
            />
          </Layout>
        </Content>

        <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={550}>
          <h2 style={{ marginBottom: "16px", textAlign: 'center' }}>
            {editingVaccine ? "Edit Vaccine" : "Add Vaccine"}
          </h2>
          <p style={{ textAlign: 'center' }}>A pop-up form to quickly add new vaccine details.</p>

          <Form
            form={form}
            layout="horizontal"
            onFinish={handleSubmit}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            labelAlign="left"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true }]}
              style={{ marginBottom: "12px" }}
            >
              <Input placeholder="e.g. Nobivac® DHPPi+L4 (Dog 8-in-1 Regular)" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true }]}
              style={{ marginBottom: "24px" }}
            >
              <Input.TextArea
                rows={4}
                maxLength={150}
                showCount
                placeholder="Enter description (max 150 characters)"
              />
            </Form.Item>
            <Form.Item
              name="manufacturer"
              label="Manufacturer"
              style={{ marginBottom: "12px" }}
            >
              <Input placeholder="e.g. MSD Animal Health" />
            </Form.Item>
            <Form.Item
              label="Image"
              required
              style={{ marginBottom: "24px" }}
            >
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <Upload
                        beforeUpload={handleBeforeUpload}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                    {imageBase64 && (
                        <img src={imageBase64} alt="Uploaded" style={{ marginTop: 10, width: "200px", maxHeight: "200px", objectFit: "contain", borderRadius:5 }} />
                    )}
                </div>
                <p style={{ color: 'red', marginTop: '8px' }}>Note: Maximum file size is 5MB.</p>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }} style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ backgroundColor: "#001529", borderColor: "#001529" }}
              >
                {editingVaccine ? "Update" : "Add"} Vaccine
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Layout>
  );
}

export default ManageVaccines;
