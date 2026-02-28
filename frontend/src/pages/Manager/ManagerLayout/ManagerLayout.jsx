import React from "react";
import { Layout, Menu, Avatar, Dropdown, Space, message } from "antd";
import {
    DashboardOutlined,
    ShoppingOutlined,
    AppstoreOutlined,
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";
import "./ManagerLayout.css";

const { Header, Sider, Content } = Layout;

const ManagerLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get user info from localStorage
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const managerName = user?.fullName || user?.email || "Manager";

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
        <Layout className="manager-layout">
            {/* Sidebar */}
            <Sider width={240} className="sidebar">
                <div className="logo">FreshMart Manager</div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    className="menu"
                >
                    <Menu.Item key="/manager/dashboard" icon={<DashboardOutlined />}>
                        <Link to="/manager/dashboard">Dashboard</Link>
                    </Menu.Item>

                    <Menu.Item key="/manager/products" icon={<ShoppingOutlined />}>
                        <Link to="/manager/products">Products</Link>
                    </Menu.Item>

                    <Menu.Item key="/manager/inventory" icon={<AppstoreOutlined />}>
                        <Link to="/manager/inventory">Inventory</Link>
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* Main */}
            <Layout>
                <Header className="manager-header">
                    <h2>Manager Dashboard</h2>

                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <Space className="user-dropdown">
                            <Avatar icon={<UserOutlined />} />
                            <span>{managerName}</span>
                        </Space>
                    </Dropdown>
                </Header>

                <Content className="manager-content">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default ManagerLayout;
