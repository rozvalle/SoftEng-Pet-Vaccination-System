import { Form, Input, Button, message, Checkbox } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/login", values);

      message.success("Login successful!");
      localStorage.setItem("isAuthenticated", true);

      navigate("/"); // ✅ Redirect after login
    } catch (error) {
      message.error(error.response?.data?.error || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        {/* <img src={loginimage} alt="Login" style={{ width: "100%", height: "100vh", objectFit: "cover" }} /> */}
      </div>
      <div className="login-form">
        <h2>Sign In</h2>

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
            <Button type="primary" htmlType="submit" style={{ width: "100%" }} loading={loading}>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}