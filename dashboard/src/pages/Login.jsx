import { Form, Input, Button, message, Checkbox } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import loginimage from "../assets/banner3.jpg";
import logo from "../assets/furcare.png"; 

export default function Login() {
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
         <img src={loginimage} alt="Login" style={{ width: "100%", height: "100vh", objectFit: "cover" }} />
      </div>
      <div className="login-form">
        <div className="login-logo">
          <img src={logo} alt="Logo" style={{ width:"300px"}} />
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
            <Button type="primary" htmlType="submit" style={{ width: "100%", backgroundColor:"#E07A5F"}} loading={loading}>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}