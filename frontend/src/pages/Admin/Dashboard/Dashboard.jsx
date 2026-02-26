import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Tag, message, Spin } from "antd";
import { Line, Pie } from "@ant-design/plots";
import { DollarOutlined, RiseOutlined } from "@ant-design/icons";
import { API_URL } from "../../../config";
import "./Dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    growth: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Fetch products
      const productsRes = await fetch(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productsData = await productsRes.json();
      
      // Fetch orders
      const ordersRes = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();

      if (productsData.success) {
        setProducts(productsData.data);
        
        setStats({
          totalProducts: productsData.data.length,
          totalRevenue: ordersData.success 
            ? ordersData.data.reduce((sum, o) => sum + (o.total_amount || 0), 0)
            : 0,
          growth: 12.5
        });
      }

      if (ordersData.success) {
        setOrders(ordersData.data);
      }
    } catch (error) {
      message.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const revenueConfig = {
    data: revenueData,
    xField: "month",
    yField: "revenue",
    smooth: true,
    height: 280,
  };

  // 🔹 Category Data
  const categoryData = products.length > 0 
    ? products.slice(0, 5).map(p => ({
        type: p.name,
        value: p.stock_quantity || 0
      }))
    : [
        { type: "Shoes", value: 27 },
        { type: "Clothes", value: 25 },
        { type: "Accessories", value: 18 },
        { type: "Other", value: 30 },
      ];

  const pieConfig = {
    data: categoryData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    height: 280,
    label: {
      type: "inner",
      offset: "-30%",
      content: "{percentage}",
    },
  };

  // 🔹 Product Table
  const productColumns = [
    {
      title: "Product",
      dataIndex: "name",
    },
    {
      title: "Category",
      render: (_, record) => record.category?.name || "Unknown",
    },
    {
      title: "Price",
      render: (_, record) => `${record.price?.toLocaleString() || 0} VND`,
    },
    {
      title: "Stock",
      dataIndex: "stock_quantity",
    },
    {
      title: "Status",
      render: (_, record) =>
        record.stock_quantity < 10 ? (
          <Tag color="red">Low Stock</Tag>
        ) : (
          <Tag color="green">In Stock</Tag>
        ),
    },
  ];

  const productData = products.slice(0, 5).map(p => ({
    key: p._id,
    name: p.name,
    category: p.category,
    price: p.price,
    stock: p.stock_quantity,
  }));

  return (
    <div className="dashboard-container">

      {/* Stats */}
      <Row gutter={16}>
        <Col span={8}>
          <Card className="stat-card">
            <Statistic title="Total Products" value={stats.totalProducts} />
          </Card>
        </Col>

        <Col span={8}>
          <Card className="stat-card">
            <Statistic
              title="Revenue"
              value={Math.round(stats.totalRevenue)}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card className="stat-card">
            <Statistic
              title="Growth"
              value={stats.growth}
              suffix="%"
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginTop: 30 }}>
        <Col span={12}>
          <Card title="Monthly Revenue" className="chart-card">
            <Line {...revenueConfig} />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Product Categories" className="chart-card">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      {/* Product Table */}
      <Card
        title="Recent Products"
        className="table-card"
        style={{ marginTop: 30 }}
      >
        <Spin spinning={loading}>
          <Table
            columns={productColumns}
            dataSource={productData}
            pagination={{ pageSize: 5 }}
          />
        </Spin>
      </Card>

    </div>
  );
};

export default Dashboard;