import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Avatar,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Popconfirm,
  message,
  Spin,
} from "antd";
import {
  SearchOutlined,
  StopOutlined,
  CheckCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { API_URL } from "../../../config";
import "./Users.css";

const { Option } = Select;

// Roles allowed by the backend createUserSchema
const ALLOWED_ROLES = ["staff", "manager"];

const getAuthHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // ===== FETCH ALL USERS =====
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      // Backend returns: { success, data: [{ id, email, username, first_name, last_name, role, is_active? }] }
      const normalized = (data.data || []).map((u) => ({
        ...u,
        key: u.id,
        _id: u.id,
        // is_active may not be returned by getAllUsers — default true
        is_active: u.is_active !== undefined ? u.is_active : true,
        fullName: `${u.first_name || ""} ${u.last_name || ""}`.trim(),
      }));
      setUsers(normalized);
    } catch (err) {
      message.error("Không thể tải danh sách user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== OPEN ADD MODAL =====
  const openAddModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  // ===== BAN / UNBAN USER =====
  const handleToggleBan = async (record) => {
    const newStatus = !record.is_active;
    try {
      const res = await fetch(`${API_URL}/api/users/${record._id}/ban`, {
        method: "PATCH",
        headers: getAuthHeader(),
        body: JSON.stringify({ is_active: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      message.success(
        newStatus ? "Đã unban user thành công" : "Đã ban user thành công"
      );
      fetchUsers();
    } catch (err) {
      message.error("Thao tác thất bại: " + err.message);
    }
  };

  // ===== SUBMIT CREATE USER =====
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user");
      message.success("Tạo user thành công");
      setIsModalOpen(false);
      form.resetFields();
      fetchUsers();
    } catch (err) {
      message.error("Tạo user thất bại: " + err.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = user.fullName || "";
    const email = user.email || "";
    const username = user.username || "";
    const roleName = user.role || "";
    const isActive = user.is_active !== false;

    return (
      (fullName.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        username.toLowerCase().includes(search.toLowerCase())) &&
      (roleFilter === "All" ||
        roleName.toLowerCase() === roleFilter.toLowerCase()) &&
      (statusFilter === "All" ||
        (statusFilter === "Active" && isActive) ||
        (statusFilter === "Inactive" && !isActive))
    );
  });

  const columns = [
    {
      title: "User",
      render: (_, record) => (
        <Space>
          <Avatar className="user-avatar">
            {(record.first_name || record.username || "?").charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>
              {record.fullName || record.username}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              @{record.username} · {record.email}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Role",
      render: (_, record) => {
        const roleName = record.role || "N/A";
        const color =
          roleName.toLowerCase() === "admin"
            ? "red"
            : roleName.toLowerCase() === "manager"
              ? "blue"
              : "gold";
        return <Tag color={color}>{roleName}</Tag>;
      },
    },
    {
      title: "Status",
      render: (_, record) => {
        const active = record.is_active !== false;
        return active ? (
          <span className="status active">
            <span className="dot green"></span> Active
          </span>
        ) : (
          <span className="status inactive">
            <span className="dot gray"></span> Inactive
          </span>
        );
      },
    },
    {
      title: "Actions",
      render: (_, record) => {
        const active = record.is_active !== false;
        return (
          <Popconfirm
            title={
              active
                ? "Bạn có chắc muốn ban user này?"
                : "Bạn có chắc muốn unban user này?"
            }
            onConfirm={() => handleToggleBan(record)}
          >
            <Button
              danger={active}
              icon={active ? <StopOutlined /> : <CheckCircleOutlined />}
            >
              {active ? "Ban" : "Unban"}
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active !== false).length;
  const adminUsers = users.filter(
    (u) => (u.role || "").toLowerCase() === "admin"
  ).length;

  return (
    <div className="users-container">
      <Row gutter={16} className="stats-row">
        <Col span={8}>
          <Card className="stat-card">
            <h4>Total Users</h4>
            <h2>{totalUsers}</h2>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stat-card">
            <h4>Active Users</h4>
            <h2>{activeUsers}</h2>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="stat-card">
            <h4>Admins</h4>
            <h2>{adminUsers}</h2>
          </Card>
        </Col>
      </Row>

      <Card className="table-card">
        <div className="table-header">
          <div>
            <h3>User Management</h3>
            <p>Manage staff, managers, and admin accounts</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Add User
          </Button>
        </div>

        <div className="filters">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name, username or email..."
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <Select defaultValue="All" onChange={setRoleFilter}>
            <Option value="All">All Roles</Option>
            {ALLOWED_ROLES.map((r) => (
              <Option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Option>
            ))}
          </Select>
          <Select defaultValue="All" onChange={setStatusFilter}>
            <Option value="All">All Status</Option>
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </div>

        <Spin spinning={loading}>
          <Table columns={columns} dataSource={filteredUsers} pagination={{ pageSize: 10 }} />
        </Spin>
      </Card>

      {/* MODAL: ADD USER */}
      <Modal
        title="Add New User"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Create"
        cancelText="Cancel"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input placeholder="e.g. Nguyen" />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input placeholder="e.g. Van A" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Please enter username" },
              { min: 3, message: "Username must be at least 3 characters" },
            ]}
          >
            <Input placeholder="e.g. nguyenvana" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="e.g. user@example.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="At least 6 characters" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select role">
              {ALLOWED_ROLES.map((r) => (
                <Option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;