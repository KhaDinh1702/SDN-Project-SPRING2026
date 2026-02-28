import React, { useState, useEffect } from "react";
import { Button, message, Tag, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { API_URL } from "../../../config";
import "./PurchaseHistory.css";

const getStatusColor = (status) => {
    switch (status) {
        case "Processing": return "orange";
        case "Shipped": return "blue";
        case "Delivered": return "green";
        case "Cancelled": return "red";
        default: return "default";
    }
};

export default function PurchaseHistory() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (!token || !user.id) {
            navigate("/login");
            return;
        }
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/orders/user/${user.id}/history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to load history");
            }

            setHistory(data.data || []);
        } catch (err) {
            message.error(err.message || "Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="purchase-history-page">
                <div className="history-container">
                    <h1>My Purchase History</h1>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "60px" }}>
                            <Spin size="large" />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="no-orders">
                            <h2>You haven't placed any orders yet.</h2>
                            <Button type="primary" onClick={() => navigate("/")} style={{ marginTop: 16 }}>
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        history.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div className="order-header-left">
                                        <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                                        <p>{new Date(order.created_at).toLocaleString("vi-VN")}</p>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <Tag className="order-status-tag" color={order.payment_status === "Paid" ? "green" : "volcano"}>
                                                {order.payment_status || "Unpaid"}
                                            </Tag>
                                            <Tag className="order-status-tag" color={getStatusColor(order.order_status)}>
                                                {order.order_status}
                                            </Tag>
                                        </div>
                                    </div>

                                    <div className="order-items">
                                        {(order.items || []).map((item, idx) => {
                                            const product = item.product_id || {};
                                            return (
                                                <div key={idx} className="order-item-row">
                                                    <div className="order-item-info">
                                                        <h4>{product.name || "Unknown Product"}</h4>
                                                        <p>Qty: {item.quantity}</p>
                                                    </div>
                                                    <div className="order-item-price">
                                                        {(item.unit_price * item.quantity).toLocaleString("vi-VN")} VND
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="order-footer">
                                        <span>Total Amount:</span>
                                        <strong>{(order.total_amount || 0).toLocaleString("vi-VN")} VND</strong>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
