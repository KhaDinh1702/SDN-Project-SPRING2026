import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Typography,
  Card
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const openAddModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setCategories(categories.filter((item) => item.key !== key));
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingCategory) {
        setCategories(
          categories.map((item) =>
            item.key === editingCategory.key
              ? { ...item, ...values }
              : item
          )
        );
      } else {
        const newCategory = {
          key: Date.now().toString(),
          products: 0,
          color: "#6366f1",
          icon: <GiCarrot />,
          ...values
        };
        setCategories([...categories, newCategory]);
      }
      setIsModalOpen(false);
    });
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
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          />
        </Space>
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
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 20
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Category Management
          </Title>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={openAddModal}
          >
            Add Category
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={categories}
          pagination={false}
        />
      </Card>

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategory;