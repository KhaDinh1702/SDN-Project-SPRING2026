import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Spin, message } from "antd";
import { Line, Pie } from "@ant-design/plots";
import { DollarOutlined, AppstoreOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { API_URL } from "../../../config";
import "./Dashboard.css";

const getAuthHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes, ordRes] = await Promise.all([
          fetch(`${API_URL}/api/products`),
          fetch(`${API_URL}/api/categories`),
          fetch(`${API_URL}/api/orders`, { headers: getAuthHeader() }),
        ]);

        const [prodJson, catJson, ordJson] = await Promise.all([
          prodRes.json(),
          catRes.json(),
          ordRes.json(),
        ]);

        setProducts(prodJson.data || prodJson || []);
        setCategories(catJson.data || catJson || []);
        setOrders(ordJson.data || ordJson || []);
      } catch (err) {
        message.error("Không thể tải dữ liệu dashboard: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ===== REVENUE từ orders =====
  const totalRevenue = orders
    .filter((o) => o.order_status === "Delivered")
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  // ===== Monthly Revenue Chart (từ orders) =====
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

  // ===== Category Pie Chart =====
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

  // ===== Recent Products table =====
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
      render: (_, record) =>
        (record.stock_quantity || 0) < 10 ? (
          <Tag color="red">Low Stock</Tag>
        ) : (
          <Tag color="green">In Stock</Tag>
        ),
    },
  ];

  const recentProducts = [...products]
    .slice(0, 5)
    .map((p) => ({ ...p, key: p._id }));

  return (
    <div className="dashboard-container">
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
                title="Total Revenue (Delivered)"
                value={totalRevenue}
                prefix={<DollarOutlined />}
                suffix="đ"
                formatter={(val) => val.toLocaleString("vi-VN")}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className="stat-card">
              <Statistic
                title="Total Orders"
                value={orders.length}
                prefix={<ShoppingCartOutlined />}
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

        {/* Recent Products */}
        <Card title="Recent Products" className="table-card" style={{ marginTop: 30 }}>
          <Table
            columns={productColumns}
            dataSource={recentProducts}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </Spin>
    </div>
  );
};

export default Dashboard;