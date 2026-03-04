import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Spin, message } from "antd";
import { Line } from "@ant-design/plots";
import { ShoppingCartOutlined, SyncOutlined, CheckCircleOutlined, DollarOutlined } from "@ant-design/icons";
import { API_URL } from "../../../config";
import "../../Admin/Dashboard/Dashboard.css";

const getAuthHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/orders`, { headers: getAuthHeader() });
                const json = await res.json();
                setOrders(json.data || json || []);
            } catch (err) {
                message.error("Không thể tải dữ liệu orders: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.order_status === "Processing").length;
    const deliveredOrders = orders.filter((o) => o.order_status === "Delivered").length;
    const totalRevenue = orders
        .filter((o) => o.order_status === "Delivered")
        .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const monthlyMap = {};
    orders.forEach((o) => {
        if (!o.created_at) return;
        const month = new Date(o.created_at).toLocaleString("default", { month: "short" });
        monthlyMap[month] = (monthlyMap[month] || 0) + (o.total_amount || 0);
    });
    const revenueData = Object.entries(monthlyMap).map(([month, revenue]) => ({
        month,
        revenue,
    }));

    const revenueConfig = {
        data: revenueData.length > 0 ? revenueData : [{ month: "N/A", revenue: 0 }],
        xField: "month",
        yField: "revenue",
        smooth: true,
        height: 280,
    };

    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map((o) => ({ ...o, key: o._id }));

    const getStatusColor = (status) => {
        switch (status) {
            case "Processing": return "orange";
            case "Shipped": return "blue";
            case "Delivered": return "green";
            case "Cancelled": return "red";
            default: return "default";
        }
    };

    const orderColumns = [
        {
            title: "Order ID",
            dataIndex: "_id",
            render: (id) => `#${id?.slice(-6).toUpperCase()}`,
        },
        {
            title: "Customer",
            render: (_, record) => {
                const u = record.user_id;
                return typeof u === "object" ? (u?.name || u?.email || "—") : (u || "—");
            },
        },
        {
            title: "Amount",
            dataIndex: "total_amount",
            render: (val) => (val || 0).toLocaleString("vi-VN") + " đ",
        },
        {
            title: "Date",
            dataIndex: "created_at",
            render: (val) => val ? new Date(val).toLocaleDateString("vi-VN") : "—",
        },
        {
            title: "Status",
            render: (_, record) => (
                <Tag color={getStatusColor(record.order_status)}>{record.order_status}</Tag>
            ),
        },
    ];

    return (
        <div className="dashboard-container">
            <h2>Staff Dashboard</h2>
            <Spin spinning={loading}>
                {/* Stats */}
                <Row gutter={16}>
                    <Col span={6}>
                        <Card className="stat-card">
                            <Statistic
                                title="Total Orders"
                                value={totalOrders}
                                prefix={<ShoppingCartOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="stat-card">
                            <Statistic
                                title="Processing"
                                value={pendingOrders}
                                prefix={<SyncOutlined spin />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="stat-card">
                            <Statistic
                                title="Delivered"
                                value={deliveredOrders}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="stat-card">
                            <Statistic
                                title="Total Revenue"
                                value={totalRevenue}
                                prefix={<DollarOutlined />}
                                suffix="đ"
                                formatter={(val) => val.toLocaleString("vi-VN")}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Charts */}
                <Row gutter={16} style={{ marginTop: 30 }}>
                    <Col span={10}>
                        <Card title="Monthly Revenue" className="chart-card">
                            <Line {...revenueConfig} />
                        </Card>
                    </Col>
                    <Col span={14}>
                        {/* Recent Orders */}
                        <Card title="Recent Orders" className="table-card">
                            <Table
                                columns={orderColumns}
                                dataSource={recentOrders}
                                pagination={false}
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
}
