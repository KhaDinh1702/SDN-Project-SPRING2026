import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Space,
    Input,
    Select,
    InputNumber,
    message,
    Tag,
    DatePicker,
    Typography
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { API_URL } from "../../../config";

const { Title } = Typography;
const { Option } = Select;

export default function Inventory() {
    const [stockHistory, setStockHistory] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState(null);
    const [form] = Form.useForm();

    const fetchStockHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/stock`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setStockHistory(data.data || []);
            } else {
                message.error(data.message || "Không thể tải lịch sử kho");
            }
        } catch (error) {
            console.error(error);
            message.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products`);
            const data = await res.json();
            if (res.ok) {
                setProducts(data.data || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchStockHistory();
        fetchProducts();
    }, []);

    const handleCreateTransaction = async (values) => {
        try {
            const payload = {
                type: values.type,
                note: values.note,
                items: values.items.map(item => ({
                    product_id: item.product_id,
                    unit_price: Number(item.unit_price) || 0,
                    quantity: Number(item.quantity) || 1,
                }))
            };

            const res = await fetch(`${API_URL}/api/stock`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                message.success("Tạo giao dịch thành công");
                setIsModalOpen(false);
                form.resetFields();
                fetchStockHistory();
            } else {
                message.error(data.message || "Tạo giao dịch thất bại");
            }
        } catch (error) {
            console.error(error);
            message.error("Network error");
        }
    };

    const handleViewDetail = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/stock/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setSelectedTx(data.data);
                setIsViewOpen(true);
            } else {
                message.error(data.message || "Không thể tải chi tiết");
            }
        } catch (error) {
            console.error(error);
            message.error("Network error");
        }
    };

    const columns = [
        {
            title: "Mã giao dịch",
            dataIndex: "id",
            key: "id",
            render: (id) => `#${id?.slice(-6).toUpperCase()}`,
        },
        {
            title: "Ngày",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: "Người tạo",
            key: "user",
            render: (_, record) => record.user?.email || "Hệ thống",
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={type === "IN" ? "green" : "red"}>
                    {type === "IN" ? "IN (Nhập)" : "OUT (Xuất)"}
                </Tag>
            ),
        },
        {
            title: "Tổng giá trị",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (val) => (val || 0).toLocaleString("vi-VN") + " đ",
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Button type="link" onClick={() => handleViewDetail(record.id)}>
                    Xem chi tiết
                </Button>
            ),
        }
    ];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <Title level={3}>Quản lý Kho hàng</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setIsModalOpen(true);
                        form.setFieldsValue({ type: 'IN', items: [{}] });
                    }}
                >
                    Giao dịch mới
                </Button>
            </div>

            <Table
                dataSource={stockHistory}
                columns={columns}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title="Tạo giao dịch kho"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                width={700}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateTransaction}
                    initialValues={{ type: 'IN', items: [{}] }}>
                    <Form.Item
                        name="type"
                        label="Loại giao dịch"
                        rules={[{ required: true, message: "Vui lòng chọn loại giao dịch" }]}
                    >
                        <Select placeholder="Chọn loại">
                            <Option value="IN">IN (Nhập kho)</Option>
                            <Option value="OUT">OUT (Xuất kho)</Option>
                        </Select>
                    </Form.Item>

                    <Form.List name="items">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'product_id']}
                                            rules={[{ required: true, message: 'Thiếu sản phẩm' }]}
                                        >
                                            <Select placeholder="Chọn sản phẩm" style={{ width: 250 }}>
                                                {products.map((p) => (
                                                    <Option key={p._id} value={p._id}>{p.name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'quantity']}
                                            rules={[{ required: true, message: 'Thiếu số lượng' }]}
                                        >
                                            <InputNumber placeholder="Số lượng" min={1} />
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'unit_price']}
                                            rules={[{ required: true, message: 'Thiếu giá' }]}
                                        >
                                            <InputNumber placeholder="Đơn giá" min={0} />
                                        </Form.Item>

                                        <Button type="dashed" onClick={() => remove(name)} danger>
                                            Xóa
                                        </Button>
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

                    <Form.Item name="note" label="Ghi chú">
                        <Input.TextArea rows={3} placeholder="Ghi chú (Không bắt buộc)" />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Chi tiết Giao dịch"
                open={isViewOpen}
                onCancel={() => setIsViewOpen(false)}
                footer={null}
                width={700}
            >
                {selectedTx && (
                    <div>
                        <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
                            <Typography.Text><b>Mã giao dịch:</b> #{selectedTx.id?.slice(-6).toUpperCase()}</Typography.Text>
                            <Typography.Text><b>Ngày:</b> {new Date(selectedTx.createdAt).toLocaleString()}</Typography.Text>
                            <Typography.Text><b>Người tạo:</b> {selectedTx.createdBy || "Hệ thống"}</Typography.Text>
                            <Typography.Text>
                                <b>Loại:</b> <Tag color={selectedTx.type === "IN" ? "green" : "red"}>{selectedTx.type === "IN" ? "IN (Nhập)" : "OUT (Xuất)"}</Tag>
                            </Typography.Text>
                            <Typography.Text><b>Tổng giá trị:</b> {(selectedTx.totalPrice || 0).toLocaleString("vi-VN")} đ</Typography.Text>
                            <Typography.Text><b>Ghi chú:</b> {selectedTx.note || "—"}</Typography.Text>
                        </Space>

                        <Title level={5}>Sản phẩm</Title>
                        <Table
                            dataSource={selectedTx.items}
                            rowKey="productId"
                            pagination={false}
                            columns={[
                                { title: 'Sản phẩm', dataIndex: 'productName' },
                                { title: 'Số lượng', dataIndex: 'quantity' },
                                { title: 'Đơn giá', dataIndex: 'unitPrice', render: (val) => (val || 0).toLocaleString("vi-VN") + " đ" },
                                { title: 'Tổng', dataIndex: 'totalPrice', render: (val) => (val || 0).toLocaleString("vi-VN") + " đ" },
                            ]}
                        />
                    </div>
                )}
            </Modal>
        </div >
    );
}
