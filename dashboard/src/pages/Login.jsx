import { Form, Input, Button, message, Checkbox, Carousel } from "antd";
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/furcare_logo.png";

export default function Login() {
  const bannerImages = [
    banner1,
    banner2,
    banner3,
  ];
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/login", values);

      message.success("Login successful!");
      sessionStorage.setItem("isAuthenticated", true);
      sessionStorage.setItem("username", values.username);

      navigate("/");
    } catch (error) {
      message.error(error.response?.data?.error || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <Carousel autoplay effect="fade">
          {[1, 2, 3].map((num) => (
            <div key={num}>
              <img
                src={bannerImages[num - 1]}
                alt={`Slide ${num}`}
                style={{ width: "100%", height: "100vh", objectFit: "cover" }}
              />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="login-form">
        <div className="login-logo">
          <img src={logo} alt="Logo" style={{ width: "50px" }} />
          <h1>Login to your Account</h1>
          <p>Welcome Back! Please Enter Your Details</p>
        </div>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            className="password-field"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember Me</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button className="custom-button" type="primary" htmlType="submit" style={{ width: "100%", borderColor: "#001529", height: "40px", borderRadius: "50px" }} loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}