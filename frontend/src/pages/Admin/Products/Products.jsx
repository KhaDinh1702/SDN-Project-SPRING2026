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

  // Stock Add States
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedStockProduct, setSelectedStockProduct] = useState(null);
  const [stockForm] = Form.useForm();

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

  // ===== QUICK ADD STOCK =====
  const handleAddStock = (record) => {
    setSelectedStockProduct(record);
    stockForm.resetFields();
    setIsStockModalOpen(true);
  };

  const handleStockSubmit = async () => {
    try {
      const values = await stockForm.validateFields();
      const res = await fetch(`${API_URL}/api/products/${selectedStockProduct._id}/stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ quantity: values.quantity, note: values.note })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      message.success(`Đã thêm ${values.quantity} vào kho thành công!`);
      setIsStockModalOpen(false);
      fetchProducts();
    } catch (err) {
      message.error("Thêm kho thất bại: " + err.message);
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

        let finalVal = val;

        // Convert boolean to string explicitly for FormData
        if (typeof finalVal === "boolean") {
          formData.append(key, finalVal.toString());
        } else {
          formData.append(key, finalVal);
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
      title: "Tên sản phẩm",
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
      title: "Danh mục",
      render: (_, r) => r.category?.name || r.category || "—",
    },
    {
      title: "Giá bán (VND)",
      dataIndex: "price",
      render: (price) => (price || 0).toLocaleString("vi-VN"),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock_quantity",
    },
    {
      title: "Trạng thái",
      render: (_, record) =>
        (record.stock_quantity || 0) < 10 ? (
          <Tag color="red">Sắp hết hàng</Tag>
        ) : (
          <Tag color="green">Còn hàng</Tag>
        ),
    },
    {
      title: "Hoạt động",
      render: (_, record) =>
        record.is_active ? (
          <Tag color="blue">Hoạt động</Tag>
        ) : (
          <Tag>Ngừng hoạt động</Tag>
        ),
    },
    {
      title: "Thao tác",
      render: (_, record) => {
        let role = "";
        try {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            role = user.role;
          }
        } catch (e) { }

        return (
          <Space>
            {role === "manager" && (
              <Button icon={<PlusOutlined />} size="small" type="primary" onClick={() => handleAddStock(record)}>
                Nhập kho
              </Button>
            )}
            <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
              Sửa
            </Button>
            <Popconfirm
              title="Xóa sản phẩm này?"
              onConfirm={() => handleDelete(record._id)}
            >
              <Button icon={<DeleteOutlined />} size="small" danger>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const lowStockProducts = data.filter((p) => (p.stock_quantity || 0) < 10);

  return (
    <Card className="product-card">
      <div className="product-header">
        <Search
          placeholder="Tìm kiếm sản phẩm..."
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(val) => fetchProducts(val)}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm sản phẩm
        </Button>
      </div>

      {lowStockProducts.length > 0 && (
        <div style={{ marginBottom: 24, padding: '16px 20px', backgroundColor: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ color: '#595959', fontSize: 16, fontWeight: 500 }}>
              Sản phẩm sắp hết hàng ({lowStockProducts.length})
            </span>
          </div>
          <div style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: 8 }}>
            <Space size={[8, 12]} wrap>
              {lowStockProducts.map(p => {
                let role = "";
                try {
                  const userStr = localStorage.getItem("user");
                  if (userStr) {
                    const user = JSON.parse(userStr);
                    role = user.role;
                  }
                } catch (e) { }

                return (
                  <div
                    key={p._id}
                    style={{
                      padding: '6px 12px',
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      backgroundColor: '#ffffff',
                      border: '1px solid #d9d9d9',
                      borderRadius: 6
                    }}
                  >
                    <span style={{ color: '#262626' }}>{p.name}</span>
                    <Tag color="error" style={{ margin: 0 }}>Còn {p.stock_quantity || 0}</Tag>
                    {role === "manager" && (
                      <Button size="small" type="default" onClick={() => handleAddStock(p)}>
                        Nhập kho
                      </Button>
                    )}
                  </div>
                );
              })}
            </Space>
          </div>
        </div>
      )}

      <Spin spinning={loading}>
        <Table columns={columns} dataSource={filteredData} />
      </Spin>

      {/* ===== MODAL ===== */}
      <Modal
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText={editingProduct ? "Cập nhật" : "Tạo mới"}
        width={700}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: "Chọn danh mục" }]}
              >
                <Select placeholder="Chọn danh mục">
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
                label="Giá bán (VND)"
                rules={[{ required: true, message: "Nhập giá bán" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Nhập mô tả" }]}
          >
            <TextArea rows={4} placeholder="Mô tả sản phẩm..." />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Trạng thái hoạt động"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item label="Hình ảnh">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={({ fileList: fl }) => setFileList(fl)}
              beforeUpload={() => false}
              multiple
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* ===== STOCK ADD MODAL ===== */}
      <Modal
        title={`Nhập kho: ${selectedStockProduct?.name || ''}`}
        open={isStockModalOpen}
        onOk={handleStockSubmit}
        onCancel={() => setIsStockModalOpen(false)}
        okText="Nhập kho"
        width={400}
      >
        <Form layout="vertical" form={stockForm}>
          <Form.Item
            name="quantity"
            label="Số lượng nhập"
            rules={[{ required: true, message: "Nhập số lượng" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
          <Form.Item
            name="note"
            label="Ghi chú (Không bắt buộc)"
          >
            <TextArea rows={2} placeholder="Lý do nhập kho..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Products;