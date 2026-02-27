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
  Spin
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { API_URL } from "../../../config";
import "./Users.css";

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        const usersWithKey = result.data.map((user) => ({
          key: user.id,
          _id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role,
          active: user.is_active !== false,
          lastLogin: user.last_login || "N/A",
          first_name: user.first_name,
          last_name: user.last_name
        }));
        setUsers(usersWithKey);
      }
    } catch (error) {
      message.error("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role,
      active: record.active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (key) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users/${key}/ban`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setUsers(users.filter((user) => user.key !== key));
        message.success("User banned successfully");
      } else {
        message.error(result.message || "Failed to ban user");
      }
    } catch (error) {
      message.error("Failed to ban user");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");

      if (editingUser) {
        // Update user
        const response = await fetch(`${API_URL}/api/users/${editingUser._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(values)
        });

        const result = await response.json();
        if (result.success) {
          setUsers(
            users.map((user) =>
              user.key === editingUser.key
                ? { ...user, ...values, name: `${values.first_name} ${values.last_name}` }
                : user
            )
          );
          message.success("User updated successfully");
        } else {
          message.error(result.message || "Failed to update user");
        }
      } else {
        // Create user
        const response = await fetch(`${API_URL}/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(values)
        });

        const result = await response.json();
        if (result.success) {
          const newUser = {
            key: result.data.id,
            _id: result.data.id,
            ...values,
            name: `${values.first_name} ${values.last_name}`,
            lastLogin: "Just now"
          };
          setUsers([...users, newUser]);
          message.success("User created successfully");
        } else {
          message.error(result.message || "Failed to create user");
        }
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) &&
      (roleFilter === "All" || user.role === roleFilter) &&
      (statusFilter === "All" ||
        (statusFilter === "Active" && user.active) ||
        (statusFilter === "Inactive" && !user.active))
    );
  });

  const columns = [
    {
      title: "User",
      render: (_, record) => (
        <Space>
          <Avatar className="user-avatar">
            {record.name.charAt(0)}
          </Avatar>
          {record.name}
        </Space>
      ),
    },
    { title: "Email", dataIndex: "email" },
    {
      title: "Role",
      render: (_, record) => {
        const color =
          record.role === "Admin"
            ? "red"
            : record.role === "Manager"
            ? "blue"
            : "gold";
        return <Tag color={color}>{record.role}</Tag>;
      },
    },
    {
      title: "Status",
      render: (_, record) =>
        record.active ? (
          <span className="status active">
            <span className="dot green"></span> Active
          </span>
        ) : (
          <span className="status inactive">
            <span className="dot gray"></span> Inactive
          </span>
        ),
    },
    { title: "Last Login", dataIndex: "lastLogin" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Delete this user?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.active).length;
  const adminUsers = users.filter((u) => u.role === "Admin").length;

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
            placeholder="Search by name or email..."
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
          />

          <Select defaultValue="All" onChange={setRoleFilter}>
            <Option value="All">All Roles</Option>
            <Option value="Admin">Admin</Option>
            <Option value="Manager">Manager</Option>
            <Option value="Staff">Staff</Option>
          </Select>

          <Select defaultValue="All" onChange={setStatusFilter}>
            <Option value="All">All Status</Option>
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            pagination={false}
          />
        </Spin>
      </Card>

      {/* MODAL FORM */}
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input type="password" />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="Manager">Manager</Option>
              <Option value="Staff">Staff</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;