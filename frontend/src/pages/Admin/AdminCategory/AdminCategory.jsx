import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Typography,
  Card,
  message,
  Spin
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";

import { GiFishCorpse, GiMeat, GiCarrot, GiChiliPepper } from "react-icons/gi";
import { API_URL } from "../../../config";

const { Title } = Typography;

const categoryIcons = [GiFishCorpse, GiMeat, GiCarrot, GiChiliPepper];
const categoryColors = ["#0ea5e9", "#ef4444", "#22c55e", "#f59e0b"];

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const data = await response.json();
      
      if (data.success) {
        const categoriesWithUI = data.data.map((cat, idx) => ({
          key: cat._id,
          _id: cat._id,
          name: cat.name,
          description: cat.description || "Category",
          products: 0,
          color: categoryColors[idx % categoryColors.length],
          icon: categoryIcons[idx % categoryIcons.length]
        }));
        setCategories(categoriesWithUI);
      }
    } catch (error) {
      message.error("Failed to load categories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (key) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/categories/${key}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setCategories(categories.filter((item) => item.key !== key));
        message.success("Category deleted successfully");
      } else {
        message.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      message.error("Failed to delete category");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");

      if (editingCategory) {
        // Update category
        const response = await fetch(`${API_URL}/api/categories/${editingCategory._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(values)
        });

        const data = await response.json();
        if (data.success) {
          setCategories(
            categories.map((item) =>
              item.key === editingCategory.key
                ? { ...item, ...values, name: data.data.name }
                : item
            )
          );
          message.success("Category updated successfully");
        } else {
          message.error(data.message || "Failed to update category");
        }
      } else {
        // Create category
        const response = await fetch(`${API_URL}/api/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(values)
        });

        const data = await response.json();
        if (data.success) {
          const newCategory = {
            key: data.data._id,
            _id: data.data._id,
            ...values,
            products: 0,
            color: categoryColors[categories.length % categoryColors.length],
            icon: categoryIcons[categories.length % categoryIcons.length]
          };
          setCategories([...categories, newCategory]);
          message.success("Category created successfully");
        } else {
          message.error(data.message || "Failed to create category");
        }
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
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

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={categories}
            pagination={false}
          />
        </Spin>
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
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategory;