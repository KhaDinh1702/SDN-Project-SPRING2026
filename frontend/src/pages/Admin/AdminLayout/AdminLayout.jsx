import React from "react";
import { Layout, Menu, Avatar, Dropdown, Space } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
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
        >
          <Menu.Item key="/admin/dashboard" icon={<DashboardOutlined />}>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Menu.Item>

          <Menu.Item key="/admin/products" icon={<ShoppingOutlined />}>
            <Link to="/admin/products">Products</Link>
          </Menu.Item>

          <Menu.Item key="/admin/categoryadmin" icon={<UserOutlined />}>
            <Link to="/admin/categoryadmin">Category</Link>
          </Menu.Item>

          <Menu.Item key="/admin/orders" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/orders">Orders</Link>
          </Menu.Item>

          <Menu.Item key="/admin/users" icon={<UserOutlined />}>
            <Link to="/admin/users">Users</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main */}
      <Layout>
        <Header className="admin-header">
          <h2>Admin Dashboard</h2>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="user-dropdown">
              <Avatar icon={<UserOutlined />} />
              <span>Admin</span>
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