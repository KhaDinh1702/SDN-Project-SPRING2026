import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Card,
  message,
  Spin
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { API_URL } from "../../../config";
import "./Orders.css";

const { Title } = Typography;
const { Option } = Select;

const Orders = () => {
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        const ordersWithKey = result.data.map((order) => ({
          key: order._id,
          _id: order._id,
          id: order._id,
          user_id: order.user_id,
          total_amount: order.total_amount,
          order_status: order.order_status || "Processing",
          created_at: new Date(order.created_at).toLocaleDateString(),
          items: order.items || []
        }));
        setOrders(ordersWithKey);
      }
    } catch (error) {
      message.error("Failed to load orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ===== Summary
  const summary = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.order_status === "Processing").length,
      shipped: orders.filter(o => o.order_status === "Shipped").length,
      delivered: orders.filter(o => o.order_status === "Delivered").length,
    };
  }, [orders]);

  // ===== Filter
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(searchText.toLowerCase()) ||
        o.user_id.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus =
        filterStatus === "All" || o.order_status === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [orders, searchText, filterStatus]);

  // ===== Status Change
  const handleStatusChange = async (value, record) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders/${record._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order_status: value })
      });

      const result = await response.json();
      if (result.success) {
        const updated = orders.map((o) =>
          o.key === record.key ? { ...o, order_status: value } : o
        );
        setOrders(updated);
        message.success("Order status updated");
      } else {
        message.error(result.message || "Failed to update order");
      }
    } catch (error) {
      message.error("Failed to update order");
      console.error(error);
    }
  };

  // ===== Add Order
  const handleAdd = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      const result = await response.json();
      if (result.success) {
        const newOrder = {
          key: result.data._id,
          _id: result.data._id,
          id: result.data._id,
          created_at: new Date().toLocaleDateString(),
          order_status: "Processing",
          items: values.items || [],
          ...values,
        };

        setOrders([...orders, newOrder]);
        message.success("Order created successfully");
        setIsModalOpen(false);
        form.resetFields();
      } else {
        message.error(result.message || "Failed to create order");
      }
    } catch (error) {
      message.error("Failed to create order");
      console.error(error);
    }
  };

  // ===== Status Color
  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "orange";
      case "Shipped":
        return "blue";
      case "Delivered":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
    },
    {
      title: "User",
      dataIndex: "user_id",
    },
    {
      title: "Items",
      render: (_, record) =>
        record.items.map(
          (item) =>
            `${item.product_id} x${item.quantity}`
        ).join(", "),
    },
    {
      title: "Amount",
      dataIndex: "total_amount",
      render: (value) =>
        value.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Status",
      render: (_, record) => (
        <Select
          value={record.order_status}
          bordered={false}
          onChange={(value) =>
            handleStatusChange(value, record)
          }
          style={{ width: 130 }}
        >
          <Option value="Processing">
            <Tag color="orange">Processing</Tag>
          </Option>
          <Option value="Shipped">
            <Tag color="blue">Shipped</Tag>
          </Option>
          <Option value="Delivered">
            <Tag color="green">Delivered</Tag>
          </Option>
          <Option value="Cancelled">
            <Tag color="red">Cancelled</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedOrder(record);
            setIsViewOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="orders-container">
      <Title level={3}>Agricultural Store Management</Title>

      {/* Summary */}
      <Row gutter={16} className="summary-row">
        <Col span={6}>
          <Card className="summary-card">
            Total Orders<br /><b>{summary.total}</b>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="summary-card yellow">
            Pending<br /><b>{summary.pending}</b>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="summary-card blue">
            Shipped<br /><b>{summary.shipped}</b>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="summary-card delivered">
            Delivered<br /><b>{summary.delivered}</b>
          </Card>
        </Col>
      </Row>

      {/* Filter */}
      <div className="top-bar">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by order ID or user..."
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Select
          defaultValue="All"
          onChange={setFilterStatus}
          style={{ width: 150 }}
        >
          <Option value="All">All Orders</Option>
          <Option value="Processing">Processing</Option>
          <Option value="Shipped">Shipped</Option>
          <Option value="Delivered">Delivered</Option>
        </Select>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Order
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          pagination={{ pageSize: 5 }}
        />
      </Spin>

      {/* Add Modal */}
      <Modal
        title="Create Order"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={handleAdd}>
          <Form.Item name="user_id" label="User ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="total_amount" label="Total Amount" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.List name="items">
            {(fields, { add }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Space key={key}>
                    <Form.Item name={[name, "product_id"]} rules={[{ required: true }]}>
                      <Input placeholder="Product ID" />
                    </Form.Item>
                    <Form.Item name={[name, "quantity"]} rules={[{ required: true }]}>
                      <InputNumber placeholder="Qty" />
                    </Form.Item>
                    <Form.Item name={[name, "price"]} rules={[{ required: true }]}>
                      <InputNumber placeholder="Price" />
                    </Form.Item>
                  </Space>
                ))}
                <Button onClick={() => add()}>Add Item</Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewOpen}
        footer={null}
        onCancel={() => setIsViewOpen(false)}
        title="Order Details"
      >
        {selectedOrder && (
          <>
            <p><b>User:</b> {selectedOrder.user_id}</p>
            <p><b>Status:</b> 
              <Tag color={getStatusColor(selectedOrder.order_status)}>
                {selectedOrder.order_status}
              </Tag>
            </p>
            <p><b>Date:</b> {selectedOrder.created_at}</p>
            <p><b>Total:</b> {selectedOrder.total_amount.toLocaleString("vi-VN")} đ</p>
            <hr />
            {selectedOrder.items.map((item, i) => (
              <p key={i}>
                {item.product_id} - {item.quantity} x {item.price}
              </p>
            ))}
          </>
        )}
      </Modal>
    </div>
  );
};

export default Orders;