import React from "react";
import { Layout, Menu, Avatar, Dropdown, Space, message } from "antd";
import {
    DashboardOutlined,
    ShoppingOutlined,
    AppstoreOutlined,
    UserOutlined,
    LogoutOutlined,
    CoffeeOutlined,
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
        message.success("Đăng xuất thành công");
        navigate("/login");
    };

    const userMenuItems = [
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Đăng xuất",
            danger: true,
            onClick: handleLogout,
        }
    ];

    return (
        <Layout className="manager-layout">
            {/* Sidebar */}
            <Sider width={240} className="sidebar">
                <div className="logo">Quản lý FreshMart</div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    className="menu"
                >
                    <Menu.Item key="/manager/dashboard" icon={<DashboardOutlined />}>
                        <Link to="/manager/dashboard">Bảng điều khiển</Link>
                    </Menu.Item>

                    <Menu.Item key="/manager/products" icon={<ShoppingOutlined />}>
                        <Link to="/manager/products">Sản phẩm</Link>
                    </Menu.Item>

                    <Menu.Item key="/manager/dishes" icon={<CoffeeOutlined />}>
                        <Link to="/manager/dishes">Món ăn</Link>
                    </Menu.Item>

                    <Menu.Item key="/manager/inventory" icon={<AppstoreOutlined />}>
                        <Link to="/manager/inventory">Kho hàng</Link>
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* Main */}
            <Layout>
                <Header className="manager-header">
                    <h2>Bảng điều khiển Quản lý</h2>

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
