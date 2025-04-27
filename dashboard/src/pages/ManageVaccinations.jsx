import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Button, Table, Modal, Form, Input, message, Popconfirm, Divider, Select, DatePicker } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import '../styles/ManageVaccinations.css'; // Adjust the path if needed
import dayjs from "dayjs";

const { Content } = Layout;

function ManageVaccinations() {
    const [vaccinations, setVaccinations] = useState([]);
    const [pets, setPets] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [filteredVaccinations, setFilteredVaccinations] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVaccination, setEditingVaccination] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchVaccinations();
        fetchPets();
        fetchVaccines();
    }, []);

    const fetchVaccinations = async () => {
        try {
            const response = await axios.get("http://localhost:5000/vaccinations");
            console.log("Vaccinations:", response.data); // Log the response data   
            setVaccinations(response.data);
            setFilteredVaccinations(response.data);
        } catch (error) {
            message.error("Error fetching vaccinations", error);
        }
    };

    const fetchPets = async () => {
        try {
            const response = await axios.get("http://localhost:5000/pets");
            setPets(response.data);
        } catch (error) {
            message.error("Error fetching pets");
        }
    };

    const fetchVaccines = async () => {
        try {
            const response = await axios.get("http://localhost:5000/vaccines");
            console.log("Vaccines:", response.data); // Log the response data
            setVaccines(response.data);
        } catch (error) {
            message.error("Error fetching vaccines");
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = vaccinations.filter((item) =>
            item.vaccine_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredVaccinations(filtered);
    };

    const handleSubmit = async (values) => {
        try {
            const formattedDate = dayjs(values.date_administered).isValid()
                ? dayjs(values.date_administered).startOf('day').format('YYYY-MM-DD')
                : null;

            const vaccinationData = {
                history_id: editingVaccination ? editingVaccination.history_id : null,
                pet_id: values.pet_id,
                vaccine_id: values.vaccine_id,
                date_administered: formattedDate,
            };
            console.log("Vaccination Data:", vaccinationData); // Log the vaccination data

            let response;
            if (editingVaccination) {
                console.log("Editing vaccination:", editingVaccination.history_id); // Log the ID of the vaccination being edited
                response = await axios.put(
                    `http://localhost:5000/vaccinations/${editingVaccination.history_id}`,
                    vaccinationData
                );
            } else {
                response = await axios.post(
                    "http://localhost:5000/vaccinations",
                    vaccinationData
                );
            }

            message.success(response.data.message || "Vaccination saved successfully");
            await fetchVaccinations();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error("Error saving vaccination:", error);
            message.error(error.response?.data?.error || "Error saving vaccination");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/vaccinations/${id}`);
            message.success("Vaccination deleted successfully");
            setVaccinations(vaccinations.filter(vaccination => vaccination.history_id !== id));
            setFilteredVaccinations(filteredVaccinations.filter(vaccination => vaccination.history_id !== id));
        } catch (error) {
            message.error("Error deleting vaccination");
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'history_id',
            key: 'history_id',
            width: 50,
        },
        {
            title: 'Vaccine Name',
            dataIndex: 'vaccine_name',
            key: 'vaccine_name',
            width: 200,
        },
        {
            title: 'Date Administered',
            dataIndex: 'date_administered',
            key: 'date_administered',
            render: (date) => date ? dayjs(date).format('MMMM D, YYYY') : '',
            width: 150,
        },
        {
            title: 'Pet',
            dataIndex: 'pet_name',
            key: 'pet_name',
            width: 150,
        },
        {
            title: '',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        icon={<EditOutlined />}
                        style={{ marginRight: 8, width: 60 }}
                        onClick={() => {
                            setEditingVaccination(record);
                            form.setFieldsValue({
                                vaccine_id: record.vaccine_id,
                                date_administered: dayjs(record.date_administered),
                                pet_id: record.pet_id,
                            });
                            setIsModalOpen(true);
                        }}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this vaccination?"
                        onConfirm={() => handleDelete(record.vaccine_id)}
                        okText="Yes"
                        cancelText="No"
                        placement="topRight"
                    >
                        <Button icon={<DeleteOutlined />} danger style={{ marginRight: 8, width: 60 }} />
                    </Popconfirm>
                </div>
            ),
        }
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Layout style={{ background: "#fefefe", padding: 0 }}>
                <Content style={{ overflow: "hidden", padding: 35 }}>
                    <h1 className="h1-user">Vaccination Management</h1>
                    <p>Track pet vaccinations, dates, and associated pets.</p>
                    <Divider className="table-divider" style={{ borderColor: "#ddd" }} />
                    <div className="table-top-parent-pet">
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
                                    borderColor: "#001529",
                                }}
                                onClick={() => {
                                    setEditingVaccination(null);
                                    form.resetFields();
                                    setIsModalOpen(true);
                                }}
                            >
                                Add Vaccination
                            </Button>
                        </div>
                    </div>
                    <Layout style={{ backgroundColor: '#fefefe', borderRadius: 10 }}>
                        <Table
                            columns={columns}
                            dataSource={filteredVaccinations}
                            size="normal"
                            bordered
                            pagination={{ pageSize: 5 }}
                            rowKey="vaccine_id"
                        />
                    </Layout>
                </Content>

                <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={500}>
                    <h2 style={{ marginBottom: "16px", textAlign: 'center' }}>
                        {editingVaccination ? "Edit Vaccination" : "Add Vaccination"}
                    </h2>
                    <p style={{ textAlign: 'center' }}>Add or edit vaccination records quickly.</p>

                    <Form
                        form={form}
                        layout="horizontal"
                        onFinish={handleSubmit}
                        labelCol={{ flex: '160px'}}
                        wrapperCol={{ flex: 1}}
                        labelAlign="left"
                    >
                        <Form.Item
                            name="vaccine_id"
                            label="Vaccine Name"
                            rules={[{ required: true }]}
                            style={{ marginBottom: "12px" }}
                            className="label-text"
                        >
                            <Select
                                placeholder="Select vaccine"
                                allowClear
                                options={vaccines.map(vaccines => ({
                                    label: vaccines.vaccine_name,
                                    value: vaccines.vaccine_id,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            name="date_administered"
                            label="Date Administered"
                            rules={[{ required: true }]}
                            style={{ marginBottom: "12px" }}
                        >
                            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                        </Form.Item>

                        <Form.Item
                            name="pet_id"
                            label="Pet"
                            rules={[{ required: true }]}
                            style={{ marginBottom: "12px" }}
                        >
                            <Select
                                placeholder="Select a pet"
                                allowClear
                                options={pets.map(pet => ({
                                    label: "ID: " + pet.pet_id + " - " + pet.pet_name,
                                    value: pet.pet_id,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 24 }} style={{ marginBottom: 0 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                style={{ backgroundColor: "#001529", borderColor: "#001529" }}
                            >
                                {editingVaccination ? "Update" : "Add"} Vaccination
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Layout>
        </Layout>
    );
}

export default ManageVaccinations;
