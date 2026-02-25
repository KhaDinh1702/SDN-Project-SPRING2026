import React from "react";
import { Card, Row, Col, Statistic, Table, Tag } from "antd";
import { Line, Pie } from "@ant-design/plots";
import { DollarOutlined, RiseOutlined } from "@ant-design/icons";
import "./Dashboard.css";

const Dashboard = () => {

  // 🔹 Revenue Data
  const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4500 },
    { month: "May", revenue: 6000 },
  ];

  const revenueConfig = {
    data: revenueData,
    xField: "month",
    yField: "revenue",
    smooth: true,
    height: 280,
  };

  // 🔹 Category Data
  const categoryData = [
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
      dataIndex: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Stock",
      dataIndex: "stock",
    },
    {
      title: "Status",
      render: (_, record) =>
        record.stock < 10 ? (
          <Tag color="red">Low Stock</Tag>
        ) : (
          <Tag color="green">In Stock</Tag>
        ),
    },
  ];

  const productData = [
    {
      key: 1,
      name: "Nike Air Max",
      category: "Shoes",
      price: "$120",
      stock: 20,
    },
    {
      key: 2,
      name: "Adidas Ultraboost",
      category: "Shoes",
      price: "$150",
      stock: 5,
    },
    {
      key: 3,
      name: "Puma RS-X",
      category: "Shoes",
      price: "$110",
      stock: 18,
    },
  ];

  return (
    <div className="dashboard-container">

      {/* Stats */}
      <Row gutter={16}>
        <Col span={8}>
          <Card className="stat-card">
            <Statistic title="Total Products" value={248} />
          </Card>
        </Col>

        <Col span={8}>
          <Card className="stat-card">
            <Statistic
              title="Revenue"
              value={14290}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card className="stat-card">
            <Statistic
              title="Growth"
              value={12.5}
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
        <Table
          columns={productColumns}
          dataSource={productData}
          pagination={{ pageSize: 5 }}
        />
      </Card>

    </div>
  );
};

export default Dashboard;