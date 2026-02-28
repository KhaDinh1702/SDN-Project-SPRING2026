import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Spin, message } from "antd";
import { Pie } from "@ant-design/plots";
import { AppstoreOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { API_URL } from "../../../config";
import "../../Admin/Dashboard/Dashboard.css";

const getAuthHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [stockHistory, setStockHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [prodRes, stockRes] = await Promise.all([
                    fetch(`${API_URL}/api/products`),
                    fetch(`${API_URL}/api/stock`, { headers: getAuthHeader() }),
                ]);

                const [prodJson, stockJson] = await Promise.all([
                    prodRes.json(),
                    stockRes.json(),
                ]);

                setProducts(prodJson.data || prodJson || []);
                setStockHistory(stockJson.data || stockJson || []);
            } catch (err) {
                message.error("Không thể tải dữ liệu dashboard: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const totalStockIn = stockHistory.filter(s => s.type === "IN").length;
    const totalStockOut = stockHistory.filter(s => s.type === "OUT").length;

    const categoryMap = {};
    products.forEach((p) => {
        const catName =
            typeof p.category === "object" ? p.category?.name : p.category || "Other";
        categoryMap[catName] = (categoryMap[catName] || 0) + 1;
    });
    const categoryData = Object.entries(categoryMap).map(([type, value]) => ({
        type,
        value,
    }));

    const pieConfig = {
        data: categoryData.length > 0 ? categoryData : [{ type: "No Data", value: 1 }],
        angleField: "value",
        colorField: "type",
        radius: 0.8,
        height: 280,
        label: {
            type: "inner",
            offset: "-30%",
            content: ({ percent }) => `${(percent * 100).toFixed(1)}%`,
            style: { fontSize: 12, textAlign: "center" },
        },
    };

    const lowStockProducts = products
        .filter((p) => (p.stock_quantity || 0) < 10)
        .slice(0, 5)
        .map((p) => ({ ...p, key: p._id }));

    const productColumns = [
        { title: "Product", dataIndex: "name" },
        {
            title: "Category",
            render: (_, r) => r.category?.name || r.category || "—",
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (p) => (p || 0).toLocaleString("vi-VN") + " đ",
        },
        { title: "Stock", dataIndex: "stock_quantity" },
        {
            title: "Status",
            render: (_, record) => (
                <Tag color="red">Low Stock</Tag>
            ),
        },
    ];

    return (
        <div className="dashboard-container">
            <h2>Manager Dashboard</h2>
            <Spin spinning={loading}>
                {/* Stats */}
                <Row gutter={16}>
                    <Col span={8}>
                        <Card className="stat-card">
                            <Statistic
                                title="Total Products"
                                value={products.length}
                                prefix={<AppstoreOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card className="stat-card">
                            <Statistic
                                title="Total Stock IN (Transactions)"
                                value={totalStockIn}
                                prefix={<ArrowUpOutlined />}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card className="stat-card">
                            <Statistic
                                title="Total Stock OUT (Transactions)"
                                value={totalStockOut}
                                prefix={<ArrowDownOutlined />}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Charts */}
                <Row gutter={16} style={{ marginTop: 30 }}>
                    <Col span={12}>
                        <Card title="Product Categories" className="chart-card">
                            <Pie {...pieConfig} />
                        </Card>
                    </Col>
                    <Col span={12}>
                        {/* Low Stock Alerts */}
                        <Card title="Low Stock Alerts (< 10 items)" className="table-card">
                            <Table
                                columns={productColumns}
                                dataSource={lowStockProducts}
                                pagination={false}
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
}
