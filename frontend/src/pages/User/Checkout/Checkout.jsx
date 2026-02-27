import { useEffect, useState } from "react";
import { Button, Form, Input, Card, Row, Col, Select, message, Spin, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./Checkout.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Checkout() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        setCartItems(JSON.parse(saved));
      } else {
        message.warning("Your cart is empty");
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      navigate("/cart");
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
    return subtotal * 1.1; // 10% tax
  };

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user._id) {
      message.error("Please login first");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // Create order
      const orderResponse = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user._id,
          customer_name: `${values.firstName} ${values.lastName}`,
          customer_email: values.email,
          customer_phone: values.phone,
          delivery_address: values.address,
          delivery_city: values.city,
          delivery_state: values.state,
          items: cartItems.map((item) => ({
            product_id: item._id,
            quantity: item.quantity || 1,
            price: item.price,
          })),
          total_amount: calculateTotal(),
          order_status: "Processing",
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        message.error(orderResult.message || "Failed to create order");
        return;
      }

      const orderId = orderResult.data._id;

      // Create VNPay payment URL
      const paymentResponse = await fetch(
        `${API_URL}/api/payment/vnpay/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount: Math.round(calculateTotal() * 100), // VNPay uses cents
            orderInfo: `Payment for order ${orderId}`,
            bankCode: values.bankCode || "",
          }),
        }
      );

      const paymentResult = await paymentResponse.json();

      if (paymentResult.success) {
        // Redirect to VNPay
        window.location.href = paymentResult.paymentUrl;
      } else {
        message.error(paymentResult.message || "Failed to create payment");
      }
    } catch (error) {
      message.error("Checkout error. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="checkout-container">
          <message.info>Loading cart...</message.info>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="checkout-container">
        <h1>Checkout</h1>

        <Row gutter={[20, 20]}>
          <Col xs={24} lg={16}>
            <Card title="Delivery Information">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="First Name"
                      name="firstName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter first name",
                        },
                      ]}
                    >
                      <Input placeholder="John" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Last Name"
                      name="lastName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter last name",
                        },
                      ]}
                    >
                      <Input placeholder="Doe" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please enter valid email",
                        },
                      ]}
                    >
                      <Input placeholder="email@example.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Phone"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Please enter phone number",
                        },
                      ]}
                    >
                      <Input placeholder="+1 (555) 000-0000" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Delivery Address"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter address",
                    },
                  ]}
                >
                  <Input placeholder="123 Main Street" />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="City"
                      name="city"
                      rules={[
                        {
                          required: true,
                          message: "Please enter city",
                        },
                      ]}
                    >
                      <Input placeholder="New York" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="State/Province"
                      name="state"
                      rules={[
                        {
                          required: true,
                          message: "Please enter state",
                        },
                      ]}
                    >
                      <Input placeholder="NY" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <Form.Item
                  label="Bank Code (Optional)"
                  name="bankCode"
                >
                  <Select placeholder="Select bank (optional)">
                    <Select.Option value="">All banks</Select.Option>
                    <Select.Option value="NCB">National Citizen Bank</Select.Option>
                    <Select.Option value="AGRIBANK">Agri Bank</Select.Option>
                    <Select.Option value="BIDV">BIDV</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    block
                  >
                    Complete Payment (${calculateTotal().toFixed(2)})
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Order Summary">
              <div className="order-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="order-item">
                    {item.image && (
                      <img src={item.image} alt={item.name} />
                    )}
                    <div>
                      <p className="item-name">{item.name}</p>
                      <p className="item-price">
                        ${item.price} x {item.quantity || 1}
                      </p>
                    </div>
                    <p className="item-total">
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Divider />

              <div className="order-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>
                    ${(calculateTotal() / 1.1).toFixed(2)}
                  </span>
                </div>
                <div className="total-row">
                  <span>Tax (10%):</span>
                  <span>${(calculateTotal() - calculateTotal() / 1.1).toFixed(2)}</span>
                </div>
                <div className="total-row total">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
}
