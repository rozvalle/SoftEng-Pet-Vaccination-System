import { Form, Input, Button, message, Checkbox } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import loginimage from "../assets/tesst.jpg";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    
    // Simulate API request (replace this with real API call)
    setTimeout(() => {
      setLoading(false);
      if (values.username === "admin" && values.password === "1234") {
        message.success("Login successful!");
        navigate("/dashboard"); // Redirect to Dashboard
      } else {
        message.error("Invalid username or password!");
      }
    }, 1000);
  };

  return (
    <div className="login-container">
        <div className="login-image">
            {/*<img src={loginimage} alt="Login" style={{ width: "100%", height: "100vh", objectFit: "cover" }} /> */}
        </div>
        <div className="login-form">
            <h2>Sign In</h2>
            
            <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="username"
                rules={[{ required: false, message: "Please enter your username!" }]}
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
                <Button type="primary" htmlType="submit" href="/" style={{ width: "100%" }}>
                    Log In
                </Button>
            </Form.Item>
            </Form>
        </div>
    </div>
  );
}
