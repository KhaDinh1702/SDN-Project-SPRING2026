import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Result, Card } from "antd";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./PaymentResult.css";

export default function PaymentResult({ status }) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [orderId, setOrderId] = useState("");
    const [message, setMessage] = useState("");
    const [transactionCode, setTransactionCode] = useState("");

    useEffect(() => {
        setOrderId(searchParams.get("orderId") || "");
        setMessage(searchParams.get("message") || "");
        setTransactionCode(searchParams.get("transactionCode") || "");
    }, [searchParams]);

    return (
        <>
            <Header />
            <div className="payment-result-page">
                <Card className="payment-result-card">
                    {status === "success" ? (
                        <Result
                            status="success"
                            title="Payment Successful!"
                            subTitle={
                                <div>
                                    <p>Your payment has been successfully processed.</p>
                                    {orderId && <p><strong>Order ID:</strong> {orderId}</p>}
                                    {transactionCode && <p><strong>Transaction Code:</strong> {transactionCode}</p>}
                                </div>
                            }
                            extra={[
                                <Button type="primary" key="orders" onClick={() => navigate("/profile")}>
                                    View My Orders
                                </Button>,
                                <Button key="home" onClick={() => navigate("/")}>
                                    Back to Home
                                </Button>,
                            ]}
                        />
                    ) : (
                        <Result
                            status="error"
                            title="Payment Failed"
                            subTitle={
                                <div>
                                    <p>Unfortunately, your payment could not be processed.</p>
                                    {message && <p><strong>Reason:</strong> {message}</p>}
                                </div>
                            }
                            extra={[
                                <Button type="primary" key="cart" onClick={() => navigate("/cart")}>
                                    Return to Cart
                                </Button>,
                                <Button key="home" onClick={() => navigate("/")}>
                                    Back to Home
                                </Button>,
                            ]}
                        />
                    )}
                </Card>
            </div>
            <Footer />
        </>
    );
}
