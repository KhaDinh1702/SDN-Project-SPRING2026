import React, { useContext, useState } from "react";
import { Button, Popconfirm, Modal, Form, Input, Radio, message } from "antd";
import { DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { CartContext } from "../../../context/CartContext";
import { API_URL } from "../../../config";

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useContext(CartContext);

    const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [form] = Form.useForm();

    const handleCheckoutClick = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            message.warning("Please login to proceed to checkout.");
            navigate("/login");
            return;
        }
        setIsCheckoutModalVisible(true);
    };

    const handleCheckout = async (values) => {
        const token = localStorage.getItem("accessToken");
        const userStr = localStorage.getItem("user");
        if (!token || !userStr) {
            message.warning("Please login to checkout");
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
                    unit_price: item.price * 25000
                })),
                payment_method: values.payment_method,
                shipping_address: values.shipping_address,
                total_amount: totalPrice * 25000
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
            if (!response.ok) throw new Error(data.message || "Failed to create order");

            if (data.success) {
                if (values.payment_method === "VNPay" && data.data.paymentUrl) {
                    // Redirect to VNPay
                    window.location.href = data.data.paymentUrl;
                } else {
                    message.success("Order placed successfully!");
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
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: 20, paddingLeft: 0, color: '#666' }}
                >
                    Continue Shopping
                </Button>

                <h1>Your Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <ShoppingCartOutlined className="cart-empty-icon" />
                        <h2>Your cart is currently empty.</h2>
                        <Button type="primary" size="large" onClick={() => navigate("/")}>
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {cartItems.map((item) => {
                                const imgUrl = item.images?.[0]?.url || item.image || "https://via.placeholder.com/150";
                                const itemName = item.name || item.title;
                                const itemId = item._id || item.id;

                                return (
                                    <div key={itemId} className="cart-item">
                                        <img src={imgUrl} alt={itemName} className="cart-item-img" />
                                        <div className="cart-item-info">
                                            <h3>{itemName}</h3>
                                            <div className="cart-item-price">{(item.price * 25000).toLocaleString("vi-VN")} VND</div>
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
                                            {((item.price * 25000) * item.quantity).toLocaleString("vi-VN")} VND
                                        </div>

                                        <Popconfirm
                                            title="Remove the item"
                                            description="Are you sure to remove this item?"
                                            onConfirm={() => removeFromCart(itemId)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <button className="cart-item-remove">
                                                <DeleteOutlined />
                                            </button>
                                        </Popconfirm>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="cart-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Items ({totalItems}):</span>
                                <span>{(totalPrice * 25000).toLocaleString("vi-VN")} VND</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping:</span>
                                <span>0 VND</span>
                            </div>

                            <div className="summary-row total">
                                <span>Total:</span>
                                <span>{(totalPrice * 25000).toLocaleString("vi-VN")} VND</span>
                            </div>

                            <Button type="primary" className="checkout-btn" onClick={handleCheckoutClick}>
                                Proceed to Checkout
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Modal
                title="Checkout Information"
                open={isCheckoutModalVisible}
                onCancel={() => setIsCheckoutModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleCheckout}>
                    <Form.Item
                        name="shipping_address"
                        label="Shipping Address"
                        rules={[{ required: true, message: "Please enter your shipping address" }]}
                    >
                        <Input.TextArea rows={3} placeholder="123 Example St, City, Country" />
                    </Form.Item>
                    <Form.Item
                        name="payment_method"
                        label="Payment Method"
                        rules={[{ required: true, message: "Please select a payment method" }]}
                        initialValue="VNPay"
                    >
                        <Radio.Group>
                            <Radio value="VNPay">Pay with VNPay</Radio>
                            <Radio value="COD">Cash on Delivery (COD)</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={checkoutLoading} block>
                            Confirm Order
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Footer />
        </>
    );
}
