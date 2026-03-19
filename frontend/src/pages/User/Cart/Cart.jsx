import React, { useContext, useState, useEffect } from "react";
import { Button, Popconfirm, Modal, Form, Input, Radio, message, Checkbox } from "antd";
import { DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Cart.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { CartContext } from "../../../context/CartContext";
import { API_URL } from "../../../config";

export default function Cart() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useContext(CartContext);

    useEffect(() => {
        if (searchParams.get("payment_success") === "true") {
            message.success(`Thanh toán thành công đơn hàng đã đặt!`);
            clearCart();
            // Xóa param khỏi URL để không bị trigger lại khi F5
            setSearchParams({});
        } else if (searchParams.get("payment_failed") === "true") {
            message.error(`Thanh toán thất bại: ${searchParams.get("message") || "Giao dịch bị từ chối"}`);
            setSearchParams({});
        }
    }, [searchParams, setSearchParams, clearCart]);

    const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [form] = Form.useForm();
    const [selectedItems, setSelectedItems] = useState([]);

    const allSelected = selectedItems.length === cartItems.length && cartItems.length > 0;
    const indeterminate = selectedItems.length > 0 && selectedItems.length < cartItems.length;

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(cartItems.map(item => item._id || item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;
        selectedItems.forEach(id => removeFromCart(id));
        setSelectedItems([]);
        message.success("Đã xóa các sản phẩm được chọn!");
    };

    const toggleItemSelect = (id, checked) => {
        if (checked) {
            setSelectedItems([...selectedItems, id]);
        } else {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        }
    };

    const handleCheckoutClick = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            message.warning("Vui lòng đăng nhập để tiến hành thanh toán.");
            navigate("/login");
            return;
        }
        setIsCheckoutModalVisible(true);
    };

    const handleCheckout = async (values) => {
        const token = localStorage.getItem("accessToken");
        const userStr = localStorage.getItem("user");
        if (!token || !userStr) {
            message.warning("Vui lòng đăng nhập để thanh toán");
            navigate("/login");
            return;
        }

        const user = JSON.parse(userStr);
        setCheckoutLoading(true);

        try {
            const orderPayload = {
                user_id: user._id || user.id,
                items: cartItems.map(item => ({
                    product_id: item._id || item.id,
                    quantity: item.quantity,
                    unit_price: item.price
                })),
                payment_method: values.payment_method,
                shipping_address: values.shipping_address,
                total_amount: totalPrice
            };

            const response = await fetch(`${API_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(orderPayload)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Tạo đơn hàng thất bại");

            if (data.success) {
                if (values.payment_method === "VNPay" && data.data.paymentUrl) {
                    // Redirect to VNPay
                    window.location.href = data.data.paymentUrl;
                } else {
                    message.success("Đặt hàng thành công!");
                    clearCart();
                    setIsCheckoutModalVisible(false);
                    navigate("/profile");
                }
            } else {
                message.error(data.message);
            }
        } catch (error) {
            message.error(error.message);
        } finally {
            setCheckoutLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="cart-page">
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/category')}
                    style={{ marginBottom: 20, paddingLeft: 0, color: '#666' }}
                >
                    Tiếp tục mua sắm
                </Button>

                <h1>Giỏ hàng của bạn</h1>

                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <ShoppingCartOutlined className="cart-empty-icon" />
                        <h2>Giỏ hàng của bạn hiện đang trống.</h2>
                        <Button type="primary" size="large" onClick={() => navigate("/")}>
                            Bắt đầu mua sắm
                        </Button>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            <div style={{ padding: "0 20px 15px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0", marginBottom: 20 }}>
                                <Checkbox indeterminate={indeterminate} onChange={handleSelectAll} checked={allSelected}>
                                    Chọn tất cả ({cartItems.length})
                                </Checkbox>
                                <Popconfirm
                                    title="Xóa sản phẩm"
                                    description="Bạn có chắc chắn muốn xóa các sản phẩm đã chọn không?"
                                    onConfirm={handleBulkDelete}
                                    okText="Có"
                                    cancelText="Không"
                                    disabled={selectedItems.length === 0}
                                >
                                    <Button danger disabled={selectedItems.length === 0}>
                                        Xóa ({selectedItems.length})
                                    </Button>
                                </Popconfirm>
                            </div>

                            {cartItems.map((item) => {
                                const imgUrl = item.images?.[0]?.url || item.image || "https://via.placeholder.com/150";
                                const itemName = item.name || item.title;
                                const itemId = item._id || item.id;
                                const isSelected = selectedItems.includes(itemId);

                                return (
                                    <div key={itemId} className="cart-item">
                                        <Checkbox 
                                            checked={isSelected}
                                            onChange={(e) => toggleItemSelect(itemId, e.target.checked)}
                                            style={{ marginRight: 15 }}
                                        />
                                        <img src={imgUrl} alt={itemName} className="cart-item-img" />
                                        <div className="cart-item-info">
                                            <h3>{itemName}</h3>
                                            <div className="cart-item-price">{(item.price).toLocaleString("vi-VN")} VND</div>
                                            <div className="cart-item-controls">
                                                <button onClick={() => updateQuantity(itemId, -1)} disabled={item.quantity <= 1}>
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(itemId, 1)}>
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="cart-item-total">
                                            {((item.price) * item.quantity).toLocaleString("vi-VN")} VND
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="cart-summary">
                            <h2>Tóm tắt đơn hàng</h2>

                            <div className="summary-row">
                                <span>Sản phẩm ({totalItems}):</span>
                                <span>{(totalPrice).toLocaleString("vi-VN")} VND</span>
                            </div>
                            <div className="summary-row">
                                <span>Phí vận chuyển:</span>
                                <span>0 VND</span>
                            </div>

                            <div className="summary-row total">
                                <span>Tổng cộng:</span>
                                <span>{(totalPrice).toLocaleString("vi-VN")} VND</span>
                            </div>

                            <Button type="primary" className="checkout-btn" onClick={handleCheckoutClick}>
                                Tiến hành thanh toán
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Modal
                title="Thông tin giao hàng"
                open={isCheckoutModalVisible}
                onCancel={() => setIsCheckoutModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleCheckout}>
                    <Form.Item
                        name="shipping_address"
                        label="Địa chỉ giao hàng"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ giao hàng" }]}
                    >
                        <Input.TextArea rows={3} placeholder="123 Example St, City, Country" />
                    </Form.Item>
                    <Form.Item
                        name="payment_method"
                        label="Phương thức thanh toán"
                        rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}
                        initialValue="VNPay"
                    >
                        <Radio.Group>
                            <Radio value="VNPay">Thanh toán với VNPay</Radio>
                            <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={checkoutLoading} block>
                            Xác nhận đặt hàng
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Footer />
        </>
    );
}
