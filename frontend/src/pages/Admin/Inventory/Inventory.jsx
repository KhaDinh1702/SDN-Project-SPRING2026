import React from "react";
import { Table, Tag, Card, Progress, Row, Col, Button } from "antd";
import {
  WarningOutlined,
  InboxOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import "./Inventory.css";

const Inventory = () => {
  const data = [
    {
      key: "1",
      name: "Organic Tomatoes",
      category: "Vegetables",
      min: 200,
      current: 450,
      max: 1000,
      lastRestocked: "2 days ago",
    },
    {
      key: "2",
      name: "Fresh Salmon",
      category: "Fish",
      min: 100,
      current: 120,
      max: 500,
      lastRestocked: "5 days ago",
    },
    {
      key: "3",
      name: "Chicken Breast",
      category: "Meat",
      min: 150,
      current: 5,
      max: 500,
      lastRestocked: "10 days ago",
    },
  ];

  const getStatus = (current, min) => {
    if (current <= min * 0.5)
      return <Tag color="red">Critical</Tag>;
    if (current <= min)
      return <Tag color="orange">Low Stock</Tag>;
    return <Tag color="green">Optimal</Tag>;
  };

  const columns = [
    { title: "Product", dataIndex: "name" },
    { title: "Category", dataIndex: "category" },
    {
      title: "Min / Current / Max",
      render: (_, record) =>
        `${record.min} / ${record.current} / ${record.max}`,
    },
    {
      title: "Stock Level",
      render: (_, record) => {
        const percent = Math.round(
          (record.current / record.max) * 100
        );
        return (
          <>
            <Progress
              percent={percent}
              size="small"
              showInfo={false}
            />
            <span>{percent}% capacity</span>
          </>
        );
      },
    },
    {
      title: "Status",
      render: (_, record) =>
        getStatus(record.current, record.min),
    },
    {
      title: "Last Restocked",
      dataIndex: "lastRestocked",
    },
  ];

  return (
    <div className="inventory-page">
      <h1 className="page-title">Inventory Management</h1>

      {/* ====== STATS ====== */}
      <Row gutter={16} className="stats-row">
        <Col span={6}>
          <Card className="stat-card">
            <InboxOutlined className="stat-icon blue" />
            <h3>248</h3>
            <p>Total Items</p>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card">
            <WarningOutlined className="stat-icon orange" />
            <h3>8</h3>
            <p>Low Stock</p>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card">
            <WarningOutlined className="stat-icon red" />
            <h3>2</h3>
            <p>Out of Stock</p>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card">
            <CheckCircleOutlined className="stat-icon green" />
            <h3>78%</h3>
            <p>Stock Efficiency</p>
          </Card>
        </Col>
      </Row>

      {/* ====== TABLE ====== */}
      <Card className="table-card">
        <Table columns={columns} dataSource={data} pagination={false} />
      </Card>

     
    </div>
  );
};

export default Inventory;