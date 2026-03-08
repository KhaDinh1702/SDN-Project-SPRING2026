import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Card,
  Input,
  message,
  Spin,
} from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { API_URL } from "../../../config";
import "./Orders.css";

const { Title } = Typography;
const { Option } = Select;

const getAuthHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const getStatusColor = (status) => {
  switch (status) {
    case "Processing": return "orange";
    case "Shipped": return "blue";
    case "Delivered": return "green";
    case "Cancelled": return "red";
    default: return "default";
  }
};

const orderStatusMap = {
  Processing: "Đang xử lý",
  Shipped: "Đang giao",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy"
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: getAuthHeader(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      const normalized = (json.data || json).map((o) => ({
        ...o,
        key: o._id,
      }));
      setOrders(normalized);
    } catch (err) {
      message.error("Không thể tải đơn hàng: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===== UPDATE STATUS =====
  const handleStatusChange = async (value, record) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${record._id}/status`, {
        method: "PATCH",
        headers: getAuthHeader(),
        body: JSON.stringify({ order_status: value }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      message.success("Cập nhật trạng thái thành công");
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o._id === record._id ? { ...o, order_status: value } : o))
      );
    } catch (err) {
      message.error("Cập nhật thất bại: " + err.message);
    }
  };

  // ===== FILTER =====
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const id = o._id || "";
      const userId =
        typeof o.user_id === "object"
          ? o.user_id?.name || o.user_id?.email || ""
          : o.user_id || "";
      const matchSearch =
        id.toLowerCase().includes(searchText.toLowerCase()) ||
        userId.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus =
        filterStatus === "All" || o.order_status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [orders, searchText, filterStatus]);

  // ===== SUMMARY =====
  const summary = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o) => o.order_status === "Processing").length,
    shipped: orders.filter((o) => o.order_status === "Shipped").length,
    delivered: orders.filter((o) => o.order_status === "Delivered").length,
  }), [orders]);

  const columns = [
    {
      title: "Mã ĐH",
      dataIndex: "_id",
      render: (id) => `#${id?.slice(-6).toUpperCase()}`,
    },
    {
      title: "Người dùng",
      render: (_, record) => {
        const u = record.user_id;
        return typeof u === "object" ? (u?.name || u?.email || "—") : (u || "—");
      },
    },
    {
      title: "Sản phẩm",
      render: (_, record) => {
        const items = record.items || record.products || [];
        return items
          .map((item) => {
            const name =
              typeof item.product_id === "object"
                ? item.product_id?.name
                : item.product_id;
            return `${name} x${item.quantity}`;
          })
          .join(", ") || "—";
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      render: (val) => (val || 0).toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Thanh toán",
      dataIndex: "payment_status",
      render: (status) => {
        let color = status === "Paid" ? "green" : "volcano";
        return <Tag color={color}>{status || "Chưa TT"}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      render: (_, record) => (
        <Select
          value={record.order_status}
          bordered={false}
          onChange={(value) => handleStatusChange(value, record)}
          style={{ width: 130 }}
        >
          {["Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
            <Option key={s} value={s}>
              <Tag color={getStatusColor(s)}>{orderStatusMap[s] || s}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "created_at",
      render: (val) => val ? new Date(val).toLocaleDateString("vi-VN") : "—",
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => { setSelectedOrder(record); setIsViewOpen(true); }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="orders-container">
      <Title level={3}>Quản lý Đơn hàng</Title>

      {/* Summary */}
      <Row gutter={16} className="summary-row">
        <Col span={6}>
          <Card className="summary-card">Tổng đơn hàng<br /><b>{summary.total}</b></Card>
        </Col>
        <Col span={6}>
          <Card className="summary-card yellow">Chờ xử lý<br /><b>{summary.pending}</b></Card>
        </Col>
        <Col span={6}>
          <Card className="summary-card blue">Đang giao<br /><b>{summary.shipped}</b></Card>
        </Col>
        <Col span={6}>
          <Card className="summary-card delivered">Đã giao<br /><b>{summary.delivered}</b></Card>
        </Col>
      </Row>

      {/* Filter */}
      <div className="top-bar">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm theo mã đơn hàng hoặc người dùng..."
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          defaultValue="All"
          onChange={setFilterStatus}
          style={{ width: 150 }}
        >
          <Option value="All">Tất cả đơn hàng</Option>
          <Option value="Processing">Đang xử lý</Option>
          <Option value="Shipped">Đang giao</Option>
          <Option value="Delivered">Đã giao</Option>
          <Option value="Cancelled">Đã hủy</Option>
        </Select>
        <Button onClick={fetchOrders}>Làm mới</Button>
      </div>

      <Spin spinning={loading}>
        <Table columns={columns} dataSource={filteredOrders} pagination={{ pageSize: 10 }} />
      </Spin>

      {/* View Detail Modal */}
      <Modal
        open={isViewOpen}
        footer={null}
        onCancel={() => setIsViewOpen(false)}
        title="Chi tiết đơn hàng"
      >
        {selectedOrder && (
          <>
            <p><b>Mã ĐH:</b> {selectedOrder._id}</p>
            <p>
              <b>Người dùng:</b>{" "}
              {typeof selectedOrder.user_id === "object"
                ? selectedOrder.user_id?.name || selectedOrder.user_id?.email
                : selectedOrder.user_id}
            </p>
            <p>
              <b>Trạng thái:</b>{" "}
              <Tag color={getStatusColor(selectedOrder.order_status)}>
                {orderStatusMap[selectedOrder.order_status] || selectedOrder.order_status}
              </Tag>
            </p>
            <p>
              <b>Thanh toán:</b>{" "}
              <Tag color={selectedOrder.payment_status === "Paid" ? "green" : "volcano"}>
                {selectedOrder.payment_status || "Chưa TT"}
              </Tag>
            </p>
            <p>
              <b>Ngày đặt:</b>{" "}
              {selectedOrder.created_at
                ? new Date(selectedOrder.created_at).toLocaleString("vi-VN")
                : "—"}
            </p>
            <p>
              <b>Tổng tiền:</b> {(selectedOrder.total_amount || 0).toLocaleString("vi-VN")} đ
            </p>
            <hr />
            <b>Items:</b>
            {(selectedOrder.items || selectedOrder.products || []).map((item, i) => {
              const name =
                typeof item.product_id === "object"
                  ? item.product_id?.name
                  : item.product_id;
              return (
                <p key={i}>
                  {name} — {item.quantity} x{" "}
                  {(item.price || 0).toLocaleString("vi-VN")} đ
                </p>
              );
            })}
          </>
        )}
      </Modal>
    </div>
  );
};

export default Orders;