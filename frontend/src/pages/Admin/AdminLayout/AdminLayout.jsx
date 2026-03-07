import React from "react";
import { Layout, Menu, Avatar, Dropdown, Space, message } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";
import "./AdminLayout.css";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get user info from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const adminName = user?.fullName || user?.email || "Admin";

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // Even if API fails, still clear local state
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    message.success("Logged out successfully");
    navigate("/login");
  };

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    }
  ];

  return (
    <Layout className="admin-layout">
      {/* Sidebar */}
      <Sider width={240} className="sidebar">
        <div className="logo">FarmAdmin</div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          className="menu"
          items={[
            {
              key: '/admin/dashboard',
              icon: <DashboardOutlined />,
              label: <Link to="/admin/dashboard">Dashboard</Link>,
            },
            {
              key: '/admin/products',
              icon: <ShoppingOutlined />,
              label: <Link to="/admin/products">Products</Link>,
            },
            {
              key: '/admin/categoryadmin',
              icon: <UserOutlined />,
              label: <Link to="/admin/categoryadmin">Category</Link>,
            },
            {
              key: '/admin/orders',
              icon: <ShoppingCartOutlined />,
              label: <Link to="/admin/orders">Orders</Link>,
            },
            {
              key: '/admin/users',
              icon: <UserOutlined />,
              label: <Link to="/admin/users">Users</Link>,
            },
          ]}
        />
      </Sider>

      {/* Main */}
      <Layout>
        <Header className="admin-header">
          <h2>Admin Dashboard</h2>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="user-dropdown">
              <Avatar icon={<UserOutlined />} />
              <span>{adminName}</span>
            </Space>
          </Dropdown>
        </Header>

        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;