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
  Spin
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { API_URL } from "../../../config";
import "./Products.css";

const { Search, TextArea } = Input;
const { Option } = Select;

const Products = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const result = await response.json();
      
      if (result.success) {
        const productsWithKey = result.data.map((prod) => ({
          key: prod._id,
          _id: prod._id,
          name: prod.name,
          price: prod.price,
          description: prod.description,
          stock_quantity: prod.stock_quantity,
          category: prod.category?._id || prod.category,
          categoryName: prod.category?.name || "Unknown",
          is_active: prod.is_active,
          images: prod.images || []
        }));
        setData(productsWithKey);
      }
    } catch (error) {
      message.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const result = await response.json();
      
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  // ===== OPEN ADD =====
  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // ===== OPEN EDIT =====
  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // ===== DELETE =====
  const handleDelete = async (key) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/products/${key}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setData(data.filter((item) => item.key !== key));
        message.success("Product deleted successfully!");
      } else {
        message.error(result.message || "Failed to delete product");
      }
    } catch (error) {
      message.error("Failed to delete product");
      console.error(error);
    }
  };

  // ===== SUBMIT =====
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");

      if (editingProduct) {
        const response = await fetch(`${API_URL}/api/products/${editingProduct._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(values)
        });

        const result = await response.json();
        if (result.success) {
          const updated = data.map((item) =>
            item.key === editingProduct.key
              ? { ...item, ...values }
              : item
          );
          setData(updated);
          message.success("Product updated successfully!");
        } else {
          message.error(result.message || "Failed to update product");
        }
      } else {
        const response = await fetch(`${API_URL}/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(values)
        });

        const result = await response.json();
        if (result.success) {
          const newProduct = {
            key: result.data._id,
            _id: result.data._id,
            ...values
          };
          setData([...data, newProduct]);
          message.success("Product added successfully!");
        } else {
          message.error(result.message || "Failed to add product");
        }
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Price (VND)",
      dataIndex: "price",
      render: (price) => price.toLocaleString(),
    },
    {
      title: "Stock",
      dataIndex: "stock_quantity",
    },
    {
      title: "Status",
      render: (_, record) =>
        record.stock_quantity < 10 ? (
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
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this product?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
            >
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
        <Input.Search 
          placeholder="Search products..." 
          style={{ width: 300 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)} 
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
                  {categories.map(cat => (
                    <Option key={cat._id} value={cat._id}>{cat.name}</Option>
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
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Enter price"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="stock_quantity"
                label="Stock Quantity"
                rules={[{ required: true, message: "Enter stock" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Enter stock quantity"
                />
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
        </Form>
      </Modal>
    </Card>
  );
};

export default Products;