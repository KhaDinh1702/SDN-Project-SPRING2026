import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tag,
  Input,
  Space,
  Popconfirm,
  message,
  Card,
  Modal,
  Form,
  InputNumber,
  Select,
  Switch,
  Row,
  Col,
  Upload,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { API_URL } from "../../../config";
import "./Products.css";

const { Search, TextArea } = Input;
const { Option } = Select;

const getToken = () => localStorage.getItem("accessToken");

const Products = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  // ===== FETCH PRODUCTS =====
  const fetchProducts = async (keyword = "") => {
    setLoading(true);
    try {
      const query = keyword ? `?keyword=${keyword}` : "";
      const res = await fetch(`${API_URL}/api/products${query}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      const normalized = (json.data || json).map((p) => ({
        ...p,
        key: p._id,
      }));
      setData(normalized);
    } catch (err) {
      message.error("Không thể tải sản phẩm: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== FETCH CATEGORIES =====
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setCategories(json.data || json);
    } catch (err) {
      message.error("Không thể tải danh mục: " + err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ===== OPEN ADD =====
  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setFileList([]);
    setIsModalOpen(true);
  };

  // ===== OPEN EDIT =====
  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      description: record.description,
      category: record.category?._id || record.category,
      is_active: record.is_active !== false,
    });
    setFileList([]);
    setIsModalOpen(true);
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      message.success("Đã xóa sản phẩm!");
      fetchProducts();
    } catch (err) {
      message.error("Xóa thất bại: " + err.message);
    }
  };

  // ===== SUBMIT ADD / EDIT =====
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      // Append text/number fields — skip undefined/null
      Object.entries(values).forEach(([key, val]) => {
        if (val === undefined || val === null) return;
        // Convert boolean to string explicitly for FormData
        if (typeof val === "boolean") {
          formData.append(key, val.toString());
        } else {
          formData.append(key, val);
        }
      });

      // Append images
      fileList.forEach((f) => {
        if (f.originFileObj) formData.append("images", f.originFileObj);
      });

      const isEdit = !!editingProduct;
      const url = isEdit
        ? `${API_URL}/api/products/${editingProduct._id}`
        : `${API_URL}/api/products`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      message.success(isEdit ? "Cập nhật thành công!" : "Tạo sản phẩm thành công!");
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      fetchProducts();
    } catch (err) {
      message.error("Thao tác thất bại: " + err.message);
    }
  };

  const filteredData = data.filter((p) =>
    (p.name || "").toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name, record) => (
        <Space>
          {record.images?.[0] && (
            <img
              src={record.images[0]}
              alt={name}
              style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
            />
          )}
          {name}
        </Space>
      ),
    },
    {
      title: "Category",
      render: (_, r) => r.category?.name || r.category || "—",
    },
    {
      title: "Price (VND)",
      dataIndex: "price",
      render: (price) => (price || 0).toLocaleString(),
    },
    {
      title: "Stock",
      dataIndex: "stock_quantity",
    },
    {
      title: "Status",
      render: (_, record) =>
        (record.stock_quantity || 0) < 10 ? (
          <Tag color="red">Low Stock</Tag>
        ) : (
          <Tag color="green">In Stock</Tag>
        ),
    },
    {
      title: "Active",
      render: (_, record) =>
        record.is_active ? (
          <Tag color="blue">Active</Tag>
        ) : (
          <Tag>Inactive</Tag>
        ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Xóa sản phẩm này?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card className="product-card">
      <div className="product-header">
        <Search
          placeholder="Search products..."
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(val) => fetchProducts(val)}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Product
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table columns={columns} dataSource={filteredData} />
      </Spin>

      {/* ===== MODAL ===== */}
      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText={editingProduct ? "Update" : "Create"}
        width={700}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Product Name"
                rules={[{ required: true, message: "Enter product name" }]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Select category" }]}
              >
                <Select placeholder="Select category">
                  {categories.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Price (VND)"
                rules={[{ required: true, message: "Enter price" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Enter description" }]}
          >
            <TextArea rows={4} placeholder="Product description..." />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Active Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item label="Images">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={({ fileList: fl }) => setFileList(fl)}
              beforeUpload={() => false}
              multiple
            >
              <Button icon={<UploadOutlined />}>Select Images</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Products;