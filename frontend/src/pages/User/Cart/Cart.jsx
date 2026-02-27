import React, { useContext } from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { CartContext } from "../../../context/CartContext";

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems } = useContext(CartContext);

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
                                            <div className="cart-item-price">${item.price}</div>
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
                                            ${(item.price * item.quantity).toFixed(2)}
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
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping:</span>
                                <span>$0.00</span>
                            </div>

                            <div className="summary-row total">
                                <span>Total:</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>

                            <Button type="primary" className="checkout-btn">
                                Proceed to Checkout
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
