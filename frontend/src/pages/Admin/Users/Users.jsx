import React, { useState } from "react";
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
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "./Users.css";

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([
    {
      key: 1,
      name: "John Smith",
      email: "john@farm.com",
      role: "Admin",
      active: true,
      lastLogin: "2024-01-22",
    },
    {
      key: 2,
      name: "Sarah Johnson",
      email: "sarah@farm.com",
      role: "Manager",
      active: true,
      lastLogin: "2024-01-22",
    },
    {
      key: 3,
      name: "Mike Wilson",
      email: "mike@farm.com",
      role: "Staff",
      active: true,
      lastLogin: "2024-01-21",
    },
    {
      key: 4,
      name: "Emma Davis",
      email: "emma@farm.com",
      role: "Staff",
      active: false,
      lastLogin: "2024-01-15",
    },
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const openAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setUsers(users.filter((user) => user.key !== key));
    message.success("User deleted");
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingUser) {
        setUsers(
          users.map((user) =>
            user.key === editingUser.key
              ? { ...user, ...values }
              : user
          )
        );
        message.success("User updated");
      } else {
        const newUser = {
          key: Date.now(),
          ...values,
          active: values.active ?? true,
          lastLogin: new Date().toISOString().split("T")[0],
        };
        setUsers([...users, newUser]);
        message.success("User added");
      }

      setIsModalOpen(false);
      form.resetFields();
    });
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

        <Table
          columns={columns}
          dataSource={filteredUsers}
          pagination={false}
        />
      </Card>

      {/* MODAL FORM */}
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

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

          <Form.Item name="active" label="Status">
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;