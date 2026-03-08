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
    MinusCircleOutlined,
} from "@ant-design/icons";
import { API_URL } from "../../../config";
import "./Dishes.css";

const { Search, TextArea } = Input;
const { Option } = Select;

const getToken = () => localStorage.getItem("accessToken");

const Dishes = () => {
    const [data, setData] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDish, setEditingDish] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    const fetchDishes = async (keyword = "") => {
        setLoading(true);
        try {
            const query = keyword ? `?keyword=${keyword}` : "";
            const res = await fetch(`${API_URL}/api/dishes${query}`);
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);
            const normalized = (json.data || json).map((d) => ({
                ...d,
                key: d._id,
            }));
            setData(normalized);
        } catch (err) {
            message.error("Không thể tải món ăn: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products`);
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);
            setProducts(json.data || json);
        } catch (err) {
            message.error("Không thể tải sản phẩm: " + err.message);
        }
    };

    useEffect(() => {
        fetchDishes();
        fetchProducts();
    }, []);

    const handleAdd = () => {
        setEditingDish(null);
        form.resetFields();
        setFileList([]);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingDish(record);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            is_active: record.is_active !== false,
            products: record.products?.map((p) => ({
                product: p.product._id || p.product,
                quantity: p.quantity,
            })) || [],
        });
        setFileList([]);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/dishes/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);
            message.success("Đã xóa món ăn!");
            fetchDishes();
        } catch (err) {
            message.error("Xóa thất bại: " + err.message);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();

            Object.entries(values).forEach(([key, val]) => {
                if (val === undefined || val === null) return;

                if (key === "products") {
                    formData.append(key, JSON.stringify(val));
                } else if (typeof val === "boolean") {
                    formData.append(key, val.toString());
                } else {
                    formData.append(key, val);
                }
            });

            fileList.forEach((f) => {
                if (f.originFileObj) formData.append("images", f.originFileObj);
            });

            const isEdit = !!editingDish;
            const url = isEdit
                ? `${API_URL}/api/dishes/${editingDish._id}`
                : `${API_URL}/api/dishes`;
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${getToken()}` },
                body: formData,
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            message.success(isEdit ? "Cập nhật thành công!" : "Tạo món ăn thành công!");
            setIsModalOpen(false);
            form.resetFields();
            setFileList([]);
            fetchDishes();
        } catch (err) {
            message.error("Thao tác thất bại: " + err.message);
        }
    };

    const filteredData = data.filter((d) =>
        (d.name || "").toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: "Tên món ăn",
            dataIndex: "name",
            render: (name, record) => (
                <Space>
                    {record.images?.[0] && (
                        <img
                            src={record.images[0].url || record.images[0]}
                            alt={name}
                            style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
                        />
                    )}
                    {name}
                </Space>
            ),
        },
        {
            title: "Trạng thái",
            render: (_, record) =>
                record.is_active ? (
                    <Tag color="blue">Hoạt động</Tag>
                ) : (
                    <Tag color="red">Ngừng hoạt động</Tag>
                ),
        },
        {
            title: "Thao tác",
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa món ăn này?"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card className="dishes-card">
            <div className="dishes-header">
                <Search
                    placeholder="Tìm kiếm món ăn..."
                    style={{ width: 300 }}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={(val) => fetchDishes(val)}
                    allowClear
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm món ăn
                </Button>
            </div>

            <Spin spinning={loading}>
                <Table columns={columns} dataSource={filteredData} />
            </Spin>

            <Modal
                title={editingDish ? "Sửa món ăn" : "Thêm món ăn"}
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={() => setIsModalOpen(false)}
                okText={editingDish ? "Cập nhật" : "Tạo mới"}
                width={700}
            >
                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                label="Tên món ăn"
                                rules={[{ required: true, message: "Nhập tên món ăn" }]}
                            >
                                <Input placeholder="Nhập tên món ăn" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <TextArea rows={3} placeholder="Mô tả món ăn..." />
                    </Form.Item>

                    {/* Dynamic Product List */}
                    <Form.List name="products">
                        {(fields, { add, remove }) => (
                            <>
                                <div style={{ marginBottom: 8 }}>Sản phẩm đi kèm</div>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, "product"]}
                                            rules={[{ required: true, message: "Thiếu sản phẩm" }]}
                                        >
                                            <Select placeholder="Chọn sản phẩm" style={{ width: 300 }}>
                                                {products.map((p) => (
                                                    <Option key={p._id} value={p._id}>
                                                        {p.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "quantity"]}
                                            rules={[{ required: true, message: "Thiếu lượng" }]}
                                        >
                                            <InputNumber placeholder="SL" min={1} />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm sản phẩm
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

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
        </Card>
    );
};

export default Dishes;
