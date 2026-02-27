import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Result, Button } from "antd";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const message = searchParams.get("message") || "Your payment could not be processed.";

  return (
    <>
      <Header />
      <div style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <Result
          status="error"
          title="Payment Failed"
          subTitle={message}
          extra={[
            <Button
              type="primary"
              key="retry"
              onClick={() => navigate("/checkout")}
            >
              Try Again
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
