import { useEffect, useState } from "react";
import { Button, Card, Form, Input, message, Spin, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./Profile.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function UserProfile() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setUser(result.data);
        form.setFieldsValue({
          firstName: result.data.first_name,
          lastName: result.data.last_name,
          email: result.data.email,
          phone: result.data.phone || "",
        });
      } else {
        message.error(result.message || "Failed to load profile");
        navigate("/login");
      }
    } catch (error) {
      message.error("Failed to load profile");
      console.error(error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setUser(result.data);
        localStorage.setItem("user", JSON.stringify(result.data));
        message.success("Profile updated successfully");
      } else {
        message.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      message.error("Error updating profile");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    message.success("Logged out successfully");
    navigate("/login");
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="profile-container">
          <Spin size="large" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="profile-container">
        <h1>My Profile</h1>

        <Card className="profile-card">
          <div className="profile-header">
            <Avatar size={100} icon={<UserOutlined />} />
            <div className="profile-info">
              <h2>{user?.first_name} {user?.last_name}</h2>
              <p>{user?.email}</p>
              <p className="role">Role: {user?.role || "Customer"}</p>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            style={{ marginTop: 30 }}
          >
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Phone" name="phone">
              <Input placeholder="Your phone number" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={updating}
              >
                Save Changes
              </Button>
            </Form.Item>
          </Form>

          <Button
            danger
            onClick={handleLogout}
            style={{ marginTop: 20 }}
          >
            Logout
          </Button>
        </Card>
      </div>
      <Footer />
    </>
  );
}
