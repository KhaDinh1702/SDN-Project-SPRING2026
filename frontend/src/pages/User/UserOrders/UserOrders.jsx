import { useEffect, useState } from "react";
import { Table, Card, message, Spin, Tag, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./UserOrders.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function UserOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user._id) {
      navigate("/login");
      return;
    }

    fetchOrders(user._id);
  }, []);

  const fetchOrders = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/orders/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setOrders(result.data || []);
      } else {
        message.error(result.message || "Failed to load orders");
      }
    } catch (error) {
      message.error("Failed to load orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Processing: "processing",
      Shipped: "warning",
      Delivered: "success",
      Cancelled: "error",
    };
    return colors[status] || "default";
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <span>{id?.substring(0, 8)}...</span>,
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Total",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => `$${amount?.toFixed(2) || 0}`,
    },
    {
      title: "Status",
      dataIndex: "order_status",
      key: "order_status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleViewDetails(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <Header />
        <div className="orders-container">
          <Spin size="large" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="orders-container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <Card>
            <p style={{ textAlign: "center" }}>
              You have no orders yet.{" "}
              <Button type="link" onClick={() => navigate("/")}>
                Start shopping
              </Button>
            </p>
          </Card>
        ) : (
          <Card>
            <Table
              columns={columns}
              dataSource={orders.map((order) => ({
                ...order,
                key: order._id,
              }))}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        )}

        <Modal
          title="Order Details"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={700}
        >
          {selectedOrder && (
            <div className="order-details">
              <div className="detail-row">
                <span className="label">Order ID:</span>
                <span>{selectedOrder._id}</span>
              </div>
              <div className="detail-row">
                <span className="label">Date:</span>
                <span>
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <Tag color={getStatusColor(selectedOrder.order_status)}>
                  {selectedOrder.order_status}
                </Tag>
              </div>

              <h3 style={{ marginTop: 20 }}>Delivery Information</h3>
              <div className="detail-row">
                <span className="label">Name:</span>
                <span>{selectedOrder.customer_name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span>{selectedOrder.customer_email}</span>
              </div>
              <div className="detail-row">
                <span className="label">Phone:</span>
                <span>{selectedOrder.customer_phone}</span>
              </div>
              <div className="detail-row">
                <span className="label">Address:</span>
                <span>
                  {selectedOrder.delivery_address},
                  {selectedOrder.delivery_city},
                  {selectedOrder.delivery_state}
                </span>
              </div>

              <h3 style={{ marginTop: 20 }}>Items</h3>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item) => (
                    <tr key={item._id}>
                      <td>{item.product_id?.name || "Unknown"}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price?.toFixed(2) || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="order-total" style={{ marginTop: 20 }}>
                <strong>Total Amount: ${selectedOrder.total_amount?.toFixed(2) || 0}</strong>
              </div>
            </div>
          )}
        </Modal>
      </div>
      <Footer />
    </>
  );
}
