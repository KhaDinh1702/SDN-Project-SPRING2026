import React from "react";
import { Layout, Menu, Avatar, Dropdown, Space, message } from "antd";
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";
import "./StaffLayout.css";

const { Header, Sider, Content } = Layout;

const StaffLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const staffName = user?.fullName || user?.email || "Staff";

    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
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
        <Layout className="staff-layout">
            {/* Sidebar */}
            <Sider width={240} className="sidebar">
                <div className="logo">FreshMart Staff</div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    className="menu"
                >
                    <Menu.Item key="/staff/dashboard" icon={<DashboardOutlined />}>
                        <Link to="/staff/dashboard">Dashboard</Link>
                    </Menu.Item>

                    <Menu.Item key="/staff/orders" icon={<ShoppingCartOutlined />}>
                        <Link to="/staff/orders">Orders</Link>
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* Main */}
            <Layout>
                <Header className="staff-header">
                    <h2>Staff Dashboard</h2>

                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <Space className="user-dropdown">
                            <Avatar icon={<UserOutlined />} />
                            <span>{staffName}</span>
                        </Space>
                    </Dropdown>
                </Header>

                <Content className="staff-content">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default StaffLayout;
