import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Button, Table, Modal, Form, Input, message, Popconfirm, Divider, Select, Upload } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import '../styles/ManagePets.css'; // Adjust the path as necessary

const { Content } = Layout;

function ManagePets() {
    const [pet, setPet] = useState([]);
    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPet, setEditingPet] = useState(null);
    const [form] = Form.useForm();
    const [users, setUsers] = useState([]);
    const [imageBase64, setImageBase64] = useState(null);

    // Function to convert image file to base64
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

    const handleBeforeUpload = async (file) => {
        if (file.size > MAX_FILE_SIZE) {
            message.error('File size exceeds 5MB limit');
            return false; // Prevent upload if file size is too large
        }

        try {
            const base64 = await getBase64(file);
            setImageBase64(base64); // Store base64 value
            form.setFieldsValue({ imgurl: base64 });
            message.success('Image uploaded successfully');
        } catch (error) {
            message.error('Error uploading image');
        }

        return false; // Prevent automatic upload to server
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/users"); // Adjust API endpoint accordingly
            setUsers(response.data);
        } catch (error) {
            message.error("Error fetching users");
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'pet_id',
            key: 'pet_id',
            width: 40,
        },
        {
            title: 'Name',
            dataIndex: 'pet_name',
            key: 'pet_name',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Sex',
            dataIndex: 'pet_sex',
            key: 'pet_sex',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Species',
            dataIndex: 'pet_species',
            key: 'pet_species',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Owner',
            dataIndex: 'owner_name',
            key: 'owner_name',
            width: 220,
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
                        onClick={() => { window.location.href = `http://localhost:5173/pets/${record.pet_id}`; }}
                    />
                    <Button
                        icon={<EditOutlined />}
                        style={{ marginRight: 8, width: 60 }}
                        onClick={() => {
                            fetchPetById(record.pet_id);
                            setEditingPet(record);
                            form.setFieldsValue({
                                name: record.pet_name,
                                sex: record.pet_sex,
                                species: record.pet_species,
                                owner_id: record.owner_id,
                                imgurl: record.pet_img,
                            });
                            setImageBase64(record.pet_img);
                            setIsModalOpen(true);
                        }}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this Pet?"
                        onConfirm={() => handleDelete(record.pet_id)}
                        okText="Yes"
                        cancelText="No"
                        placement="topRight"
                    >
                        <Button icon={<DeleteOutlined />} danger style={{ width: 60 }} />
                    </Popconfirm>
                </div>
            ),
        }
    ];

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const response = await axios.get("http://localhost:5000/pets");
            setPets(response.data);
            setFilteredPets(response.data);
        } catch (error) {
            message.error("Error fetching pets");
        }
    };

    const fetchPetById = async (id) => {
        try {
            const response = await axios.get("http://localhost:5000/pets/" + id);
            if (response.data && response.data.length > 0) {
                const petData = response.data[0]; // Get the first item from the array
                console.log('Fetched pet data:', petData);
                setPet(petData);  // Set the pet object
            } else {
                console.error('No pet data found');
            }
        } catch (error) {
            message.error("Error fetching pet");
            console.error(error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            const petData = {
                owner_id: values.owner_id,
                pet_name: values.name,
                pet_sex: values.sex,
                pet_species: values.species,
                pet_img: imageBase64,
            };

            console.log("Pet Data to Submit:", petData); // Debugging log

            let response;
            if (editingPet) {
                response = await axios.put(
                    `http://localhost:5000/pets/${editingPet.pet_id}`,
                    petData
                );
            } else {
                response = await axios.post(
                    "http://localhost:5000/pets",
                    petData
                );
            }

            message.success(response.data.message || "Pet saved successfully");
            await fetchPets();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error("Error saving pet:", error);
            message.error(error.response?.data?.error || "Error saving pet");
        }
    };

    const handleDelete = async (id) => {
        if (!id) {
            console.error("Error: Pet ID is undefined");
            message.error("Cannot delete Pet: Missing Pet ID");
            return;
        }

        console.log(`Attempting to delete pet with ID: ${id}`);
        await axios.delete(`http://localhost:5000/pets/${id}`);
        message.success("Pet deleted successfully");
        fetchPets();
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Layout style={{ background: "#fefefe", padding: 0 }}>
                <Content style={{ overflow: "hidden", padding: 35 }}>
                    <h1 className="h1-user">Pet Management</h1>
                    <p>Maintains pet profiles including name, species, breed, age, and owner association.</p>
                    <Divider className='table-divider' style={{ borderColor: "#ddd" }} />
                    <div className="table-top-parent-pet">
                        <div className="header-user">
                            <Input.Search
                                placeholder="Search pet..."
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
                                    setEditingPet(null);
                                    form.resetFields();
                                    setImageBase64(null);
                                    setIsModalOpen(true);
                                }}
                            >
                                Add Pet
                            </Button>
                        </div>
                    </div>
                    <Layout style={{ backgroundColor: '#fefefe', borderRadius: 10 }}>
                        <Table
                            columns={columns}
                            dataSource={filteredPets}
                            size="normal"
                            bordered
                            pagination={{ pageSize: 5 }}
                        />
                    </Layout>
                </Content>

                <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={500}>
                    <h2 style={{ marginBottom: "16px", textAlign: 'center' }}>
                        {editingPet ? "Edit Pet" : "Add Pet"}
                    </h2>
                    <p style={{ textAlign: 'center' }}>A pop-up form to quickly add new pet details.</p>

                    <Form
                        form={form}
                        layout="horizontal"
                        onFinish={handleSubmit}
                        labelCol={{ flex: '100px' }}
                        wrapperCol={{ flex: 1 }}
                        labelAlign="left"
                    >
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true }]}
                            style={{ marginBottom: "12px" }}
                        >
                            <Input placeholder="e.g. Max"
                                onChange={(e) => {
                                    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                    form.setFieldsValue({ name: lettersOnly });
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="sex"
                            label="Sex"
                            rules={[{ required: true }]}
                            style={{ marginBottom: "12px" }}
                        >
                            <Select
                                placeholder="Select sex"
                                allowClear
                                options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
                            />
                        </Form.Item>
                        <Form.Item
                            name="species"
                            label="Species"
                            rules={[{ required: true }]}
                            style={{ marginBottom: "12px" }}
                        >
                            <Select
                                placeholder="Select species"
                                allowClear
                                options={[{ value: 'canine', label: 'Canine' }, { value: 'feline', label: 'Feline' }, { value: 'others', label: 'Others' }]}
                            />
                        </Form.Item>
                        <Form.Item
                            name="owner_id"
                            label="Owner"
                            rules={[{ required: true }]}
                            style={{ marginBottom: "12px" }}
                        >
                            <Select
                                placeholder="Select an owner"
                                allowClear
                                options={users.map(user => ({
                                    label: `${user.user_fn} ${user.user_ln}`,  // Adjust this if needed
                                    value: user.user_id, // Adjust this field to match the correct user ID
                                }))}
                            />
                        </Form.Item>
                        <Form.Item name="imgurl" label="Image" rules={[{ required: false }]} style={{ marginBottom: 0 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Upload
                                    beforeUpload={handleBeforeUpload}
                                    showUploadList={false}
                                >
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                                {imageBase64 && (
                                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
                                        <img
                                            src={imageBase64}
                                            alt="Uploaded"
                                            style={{
                                                width: "200px",
                                                maxHeight: "200px",
                                                objectFit: "contain",
                                                borderRadius: 5,
                                                marginRight: 10,
                                            }}
                                        />
                                        <Button
                                            type="danger"
                                            onClick={() => {
                                                setImageBase64(null);
                                                form.setFieldsValue({ imgurl: null });
                                            }}
                                        >
                                            <DeleteOutlined style={{ color: "red", fontSize: '16px' }} />
                                        </Button>
                                    </div>
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
                                {editingPet ? "Update" : "Add"} Pet
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Layout>
        </Layout>
    );
}

export default ManagePets;
