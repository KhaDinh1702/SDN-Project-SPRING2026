import React, { useState } from "react";
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
  Image,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "./Products.css";

const { Search, TextArea } = Input;
const { Option } = Select;

const Products = () => {
  const [data, setData] = useState([
    {
      key: "1",
      name: "Apple",
      price: 25000,
      description: "Fresh red apple",
      stock_quantity: 100,
      category: "Fruits",
      is_active: true,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.success("Product deleted successfully!");
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        const updated = data.map((item) =>
          item.key === editingProduct.key
            ? { ...item, ...values }
            : item
        );
        setData(updated);
        message.success("Product updated successfully!");
      } else {
        const newProduct = {
          key: Date.now().toString(),
          ...values,
        };
        setData([...data, newProduct]);
        message.success("Product added successfully!");
      }

      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (image) => (
        <Image
          src={image}
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    { title: "Name", dataIndex: "name" },
    {
      title: "Price (VND)",
      dataIndex: "price",
      render: (price) => price?.toLocaleString(),
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
        <Search placeholder="Search products..." style={{ width: 300 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Product
        </Button>
      </div>

      <Table columns={columns} dataSource={data} rowKey="key" />

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
                  <Option value="Fruits">Fruits</Option>
                  <Option value="Vegetables">Vegetables</Option>
                  <Option value="Meat">Meat</Option>
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
            name="image"
            label="Image URL"
            rules={[{ required: true, message: "Enter image URL" }]}
          >
            <Input placeholder="Paste image URL here..." />
          </Form.Item>

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