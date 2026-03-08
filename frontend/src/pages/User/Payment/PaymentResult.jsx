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
                            title="Thanh toán thành công!"
                            subTitle={
                                <div>
                                    <p>Giao dịch thanh toán của bạn đã được xử lý thành công.</p>
                                    {orderId && <p><strong>Mã đơn hàng:</strong> {orderId}</p>}
                                    {transactionCode && <p><strong>Mã giao dịch:</strong> {transactionCode}</p>}
                                </div>
                            }
                            extra={[
                                <Button type="primary" key="orders" onClick={() => navigate("/profile")}>
                                    Xem đơn hàng của tôi
                                </Button>,
                                <Button key="home" onClick={() => navigate("/")}>
                                    Về trang chủ
                                </Button>,
                            ]}
                        />
                    ) : (
                        <Result
                            status="error"
                            title="Thanh toán thất bại"
                            subTitle={
                                <div>
                                    <p>Rất tiếc, giao dịch thanh toán của bạn không thể thực hiện được.</p>
                                    {message && <p><strong>Lý do:</strong> {message}</p>}
                                </div>
                            }
                            extra={[
                                <Button type="primary" key="cart" onClick={() => navigate("/cart")}>
                                    Quay lại giỏ hàng
                                </Button>,
                                <Button key="home" onClick={() => navigate("/")}>
                                    Về trang chủ
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
