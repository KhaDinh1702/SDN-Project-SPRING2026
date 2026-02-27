import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Result, Button, Spin } from "antd";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Payment was successful, clear cart
    localStorage.removeItem("cart");
  }, []);

  const orderId = searchParams.get("orderId") || searchParams.get("vnp_TxnRef")?.split("_")[0];

  return (
    <>
      <Header />
      <div style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <Result
          status="success"
          title="Payment Successful!"
          subTitle={orderId ? `Your order ${orderId} has been confirmed.` : "Your payment has been processed successfully."}
          extra={[
            <Button
              type="primary"
              key="orders"
              onClick={() => navigate("/orders")}
            >
              View Orders
            </Button>,
            <Button
              key="home"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>,
          ]}
        />
      </div>
      <Footer />
    </>
  );
}
