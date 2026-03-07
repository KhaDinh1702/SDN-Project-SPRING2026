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
  Upload,
  Tabs,
  Image,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { GiFishCorpse, GiMeat, GiCarrot, GiChiliPepper } from "react-icons/gi";
import { API_URL } from "../../../config";

const { Title } = Typography;

const getAuthHeader = () => ({
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

  // Image state
  const [imageTab, setImageTab] = useState("url"); // "url" | "upload"
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        headers: { ...getAuthHeader() },
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
      message.error("Failed to load categories: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ===== RESET IMAGE STATE =====
  const resetImageState = () => {
    setImageTab("url");
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
  };

  // ===== OPEN MODALS =====
  const openAddModal = () => {
    setEditingCategory(null);
    form.resetFields();
    resetImageState();
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({ name: record.name, description: record.description });
    resetImageState();
    if (record.image) {
      setImageTab("url");
      setImageUrl(record.image);
      setImagePreview(record.image);
    }
    setIsModalOpen(true);
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      message.success("Category deleted");
      fetchCategories();
    } catch (err) {
      message.error("Delete failed: " + err.message);
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

      let res;

      if (imageTab === "upload" && imageFile) {
        // Send as multipart/form-data when file is selected
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description || "");
        formData.append("image", imageFile);

        res = await fetch(url, {
          method,
          headers: getAuthHeader(), // NO Content-Type → browser sets boundary
          body: formData,
        });
      } else {
        // Send as JSON with optional image URL
        res = await fetch(url, {
          method,
          headers: { ...getAuthHeader(), "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            image: imageTab === "url" ? imageUrl : "",
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      message.success(isEdit ? "Category updated successfully" : "Category created successfully");
      setIsModalOpen(false);
      form.resetFields();
      resetImageState();
      fetchCategories();
    } catch (err) {
      message.error("Operation failed: " + err.message);
    }
  };

  // ===== FILE UPLOAD HANDLER =====
  const handleFileChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "name",
      render: (_, record) => (
        <Space>
          {record.image ? (
            <img
              src={record.image}
              alt={record.name}
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                objectFit: "cover",
                border: "1px solid #e5e7eb",
              }}
            />
          ) : (
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
          )}
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
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "url",
      label: (
        <span>
          <LinkOutlined /> Paste URL
        </span>
      ),
      children: (
        <div>
          <Input
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImagePreview(e.target.value);
            }}
          />
          {imagePreview && imageTab === "url" && (
            <div style={{ marginTop: 10, textAlign: "center" }}>
              <Image
                src={imagePreview}
                alt="preview"
                style={{ maxHeight: 120, borderRadius: 10, objectFit: "cover" }}
                preview={false}
                onError={() => setImagePreview("")}
              />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "upload",
      label: (
        <span>
          <UploadOutlined /> Upload File
        </span>
      ),
      children: (
        <div>
          <Upload
            showUploadList={false}
            beforeUpload={() => false} // prevent auto upload
            onChange={handleFileChange}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Choose Image</Button>
          </Upload>
          {imagePreview && imageTab === "upload" && (
            <div style={{ marginTop: 10, textAlign: "center" }}>
              <img
                src={imagePreview}
                alt="preview"
                style={{ maxHeight: 120, borderRadius: 10, objectFit: "cover" }}
              />
            </div>
          )}
        </div>
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
        onCancel={() => {
          setIsModalOpen(false);
          resetImageState();
        }}
        width={520}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Category Name" rules={[{ required: true, message: "Please enter a category name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item label="Image (optional)">
            <Tabs
              activeKey={imageTab}
              onChange={(key) => {
                setImageTab(key);
                setImagePreview(key === "url" ? imageUrl : "");
              }}
              items={tabItems}
              size="small"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategory;