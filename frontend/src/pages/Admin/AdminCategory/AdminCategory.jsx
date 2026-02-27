import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Card
} from "antd";
import {
  DeleteOutlined
} from "@ant-design/icons";

import { GiFishCorpse, GiMeat, GiCarrot, GiChiliPepper } from "react-icons/gi";

const { Title } = Typography;

const AdminCategory = () => {
  const [categories, setCategories] = useState([
    {
      key: "1",
      name: "Seafood",
      description: "Fresh ocean products",
      products: 18,
      color: "#0ea5e9",
      icon: <GiFishCorpse />
    },
    {
      key: "2",
      name: "Meat",
      description: "Premium meat selection",
      products: 32,
      color: "#ef4444",
      icon: <GiMeat />
    },
    {
      key: "3",
      name: "Vegetables",
      description: "Organic farm vegetables",
      products: 45,
      color: "#22c55e",
      icon: <GiCarrot />
    },
    {
      key: "4",
      name: "Spices",
      description: "Natural spice collection",
      products: 25,
      color: "#f59e0b",
      icon: <GiChiliPepper />
    }
  ]);

  const handleDelete = (key) => {
    setCategories(categories.filter((item) => item.key !== key));
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "name",
      render: (_, record) => (
        <Space>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: record.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 20
            }}
          >
            {record.icon}
          </div>
          <div>
            <strong style={{ fontSize: 15 }}>{record.name}</strong>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {record.description}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: "Products",
      dataIndex: "products",
      render: (value) => (
        <div
          style={{
            background: "#eef2ff",
            color: "#4338ca",
            padding: "6px 14px",
            borderRadius: 999,
            fontWeight: 600,
            display: "inline-block",
            minWidth: 60,
            textAlign: "center"
          }}
        >
          {value} items
        </div>
      )
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.key)}
        />
      )
    }
  ];

  return (
    <div style={{ padding: 40, background: "#f1f5f9", minHeight: "100vh" }}>
      <Card
        style={{
          borderRadius: 20,
          boxShadow: "0 10px 40px rgba(0,0,0,0.05)"
        }}
      >
        <Title level={3} style={{ marginBottom: 20 }}>
          Category Management
        </Title>

        <Table
          columns={columns}
          dataSource={categories}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AdminCategory;