import React from "react";
import { Layout, Card, Typography, Row, Col, Button } from "antd";
import { FolderOpenOutlined, CalendarOutlined, SmileOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined} from "@ant-design/icons";
import "../styles/About.css"; // Adjust the path if necessary
const { Content } = Layout;
const { Title, Paragraph } = Typography;

function About() {
return (
    <Layout style={{ minHeight: "100vh", background: "#fefefe" }}>
        <div className="about-header">
            <div className="about-header-content">
                <Title level={2} style={{ textAlign: 'center', marginBottom: 20, color: 'white' }}>Welcome to Our Pet Vaccination Management System</Title>
                <Paragraph style={{ textAlign: "center", maxWidth: 800, color: 'white' }}>
                    Keeping your pets healthy, one vaccination at a time.
                </Paragraph>
            </div>
        </div>
        <Content style={{ padding: "35px", display: "flex", flexDirection: 'column', alignItems: "center" }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>About the System</Title>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "row", gap: 50 }}>

                <div>
                    <Paragraph style={{ textAlign: "center", maxWidth: 1000}}>
                            The <b>Pet Vaccination Management System</b> is designed to help veterinary clinics
                            efficiently manage pet records, vaccination schedules, and owner information.
                    </Paragraph>
                    <Paragraph style={{ textAlign: "center", maxWidth: 1000 }}>
                        Developed by <b>Francis Elmo Valeros</b>, this system aims to ensure pets receive timely vaccinations
                        and proper care.
                    </Paragraph>
                </div>
            </div>

            <div style={{ width:1000, marginTop: 50, marginBottom: 50 }}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card variant="outlined" className="about-features">
                        <SmileOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                        <h3>Pet Management</h3>
                        <p>Easily add, update, and manage your pets’ profiles and vaccination records.</p>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card variant="outlined" className="about-features">
                        <FolderOpenOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                        <h3>Record Keeping</h3>
                        <p>Securely store all vaccination and owner information for easy access anytime.</p>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card variant="outlined" className="about-features">
                        <CalendarOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                        <h3>Vaccination Tracking</h3>
                        <p>Stay up-to-date with upcoming vaccination schedules and important reminders.</p>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>Why Vaccination Management is Important</Title>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "row", gap: 50, marginBottom: 50 }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", maxWidth: 1000, gap: 30 }}>
                    {/* <img src={about} alt="About" style={{ width: 600, height: 300, objectFit: "cover", borderRadius: 8 }} /> */}
                    <Paragraph style={{ textAlign: "center"}}>
                        Keeping track of pet vaccinations is essential to ensure their lifelong health and protection against preventable diseases.
                        Proper vaccination schedules not only safeguard pets but also promote the safety of the community by minimizing the spread of contagious illnesses.
                        With an organized system, pet owners can easily stay updated and take timely action, leading to healthier, happier pets.
                    </Paragraph>
                </div>
            </div>

            <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>We're here to Help</Title>
            <div style={{ display: "flex", textAlign:'center', justifyContent: "center", alignItems: "center", flexDirection: "column", marginBottom: 50, width: 600 }}>
                <p>If you have any questions or need help managing your pet’s vaccination records, we're here for you.
                <a>👉 Contact Us to get the support you need!</a></p>
            </div>
        </Content>

    </Layout>
);
}

export default About;
