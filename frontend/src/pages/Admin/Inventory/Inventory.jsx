import React, { useEffect, useState } from "react";
import { Table, Tag, Card, Progress, Row, Col, Button, message, Spin } from "antd";
import {
  WarningOutlined,
  InboxOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { API_URL } from "../../../config";
import "./Inventory.css";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const result = await response.json();
      
      if (result.success) {
        const inventoryData = result.data.map((product) => ({
          key: product._id,
          _id: product._id,
          name: product.name,
          category: product.category?.name || "Unknown",
          min: 100, // default minimum
          current: product.stock_quantity,
          max: 1000, // default maximum
          lastRestocked: "N/A",
        }));
        setProducts(inventoryData);
      }
    } catch (error) {
      message.error("Failed to load inventory");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const totalItems = products.reduce((sum, p) => sum + p.current, 0);
  const lowStockItems = products.filter(p => p.current <= p.min).length;
  const outOfStockItems = products.filter(p => p.current === 0).length;
  const avgEfficiency = products.length > 0 
    ? Math.round((products.reduce((sum, p) => sum + (p.current / p.max) * 100, 0) / products.length))
    : 0;

  return (
    <div className="inventory-page">
      <h1 className="page-title">Inventory Management</h1>

      {/* ====== STATS ====== */}
      <Row gutter={16} className="stats-row">
        <Col span={6}>
          <Card className="stat-card">
            <InboxOutlined className="stat-icon blue" />
            <h3>{totalItems}</h3>
            <p>Total Items</p>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card">
            <WarningOutlined className="stat-icon orange" />
            <h3>{lowStockItems}</h3>
            <p>Low Stock</p>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card">
            <WarningOutlined className="stat-icon red" />
            <h3>{outOfStockItems}</h3>
            <p>Out of Stock</p>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card">
            <CheckCircleOutlined className="stat-icon green" />
            <h3>{avgEfficiency}%</h3>
            <p>Stock Efficiency</p>
          </Card>
        </Col>
      </Row>

      {/* ====== TABLE ====== */}
      <Card className="table-card">
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={products} pagination={false} />
        </Spin>
      </Card>

     
    </div>
  );
};

export default Inventory;