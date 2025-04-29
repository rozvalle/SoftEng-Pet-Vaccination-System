import React from "react";
import { Layout, Card, Typography, Row, Col, Button, Form, Input } from "antd";
import { FolderOpenOutlined, CalendarOutlined, SmileOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined} from "@ant-design/icons";
import "../styles/Contact.css"; // Adjust the path if necessary
const { Content } = Layout;
const { Title, Paragraph } = Typography;

function Contact() {
return (
    <Layout style={{ minHeight: "100vh", background: "#fefefe", alignItems: "center" }}>
        <div className="contact-header">
            <div className="contact-header-content">
                <Title level={2} style={{ textAlign: 'center', marginBottom: 20, color: 'white' }}>Contact Us</Title>
                <Paragraph style={{ textAlign: "center", maxWidth: 800, color: 'white' }}>
                    If you have any questions or need assistance, feel free to reach out. We're here to help!
                </Paragraph>
            </div>
        </div>

        <div className="contact-content" style={{ width: '70%', padding: 35, paddingBottom:0}}>
            <div style={{ marginBottom: '32px', width: "50%" }}>
                <h1 style={{margin:0}}>Get in touch with us</h1><br />
                <p><MailOutlined style={{ marginRight: 8 }} /> contact@yourdomain.com</p>
                <p><PhoneOutlined style={{ marginRight: 8 }} /> +63 912 345 6789</p>
                <p><EnvironmentOutlined style={{ marginRight: 8 }} /> 1234 Main Street, Manila, Philippines</p>
            </div>

            <div style={{ width: "50%"}}>
                <Form layout="vertical">
                    <Form.Item label="Your Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                    <Input placeholder="Enter your name" />
                    </Form.Item>

                    <Form.Item label="Your Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                    <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item label="Message" name="message" rules={[{ required: true, message: 'Please enter your message' }]}>
                    <Input.TextArea rows={4} style={{resize:'none'}} placeholder="Enter your message" />
                    </Form.Item>

                    <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Send Message
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
        
    </Layout>
);
}

export default Contact;
