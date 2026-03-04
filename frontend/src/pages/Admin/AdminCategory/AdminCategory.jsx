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
  Popconfirm,
  message,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { GiFishCorpse, GiMeat, GiCarrot, GiChiliPepper } from "react-icons/gi";
import { API_URL } from "../../../config";

const { Title } = Typography;

const getAuthHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const getCategoryIcon = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("seafood") || n.includes("fish")) return <GiFishCorpse />;
  if (n.includes("meat")) return <GiMeat />;
  if (n.includes("veg")) return <GiCarrot />;
  if (n.includes("spice") || n.includes("chili")) return <GiChiliPepper />;
  return <GiCarrot />;
};

const COLORS = ["#0ea5e9", "#ef4444", "#22c55e", "#f59e0b", "#6366f1", "#ec4899"];

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const normalized = (data.data || data).map((c, i) => ({
        ...c,
        key: c._id,
        color: COLORS[i % COLORS.length],
        icon: getCategoryIcon(c.name),
      }));
      setCategories(normalized);
    } catch (err) {
      message.error("Không thể tải danh mục: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ===== OPEN MODALS =====
  const openAddModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({ name: record.name, description: record.description });
    setIsModalOpen(true);
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      message.success("Đã xóa danh mục");
      fetchCategories();
    } catch (err) {
      message.error("Xóa thất bại: " + err.message);
    }
  };

  // ===== SUBMIT ADD / EDIT =====
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const isEdit = !!editingCategory;
      const url = isEdit
        ? `${API_URL}/api/categories/${editingCategory._id}`
        : `${API_URL}/api/categories`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeader(),
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      message.success(isEdit ? "Cập nhật danh mục thành công" : "Tạo danh mục thành công");
      setIsModalOpen(false);
      form.resetFields();
      fetchCategories();
    } catch (err) {
      message.error("Thao tác thất bại: " + err.message);
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
              fontSize: 20,
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
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 40, background: "#f1f5f9", minHeight: "100vh" }}>
      <Card style={{ borderRadius: 20, boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
        <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 20 }}>
          <Title level={3} style={{ margin: 0 }}>
            Category Management
          </Title>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openAddModal}>
            Add Category
          </Button>
        </Space>

        <Spin spinning={loading}>
          <Table columns={columns} dataSource={categories} pagination={false} />
        </Spin>
      </Card>

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategory;