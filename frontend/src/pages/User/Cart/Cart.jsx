import { useEffect, useState } from "react";
import { Button, Table, InputNumber, message, Empty, Card, Row, Col } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [checkout, setCheckout] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const saveCart = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemove(productId);
      return;
    }

    const updated = cartItems.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    setCartItems(updated);
    saveCart(updated);
  };

  const handleRemove = (productId) => {
    const updated = cartItems.filter((item) => item._id !== productId);
    setCartItems(updated);
    saveCart(updated);
    message.success("Product removed from cart");
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="product-cell">
          {record.image && <img src={record.image} alt={text} />}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity || 1}
          onChange={(value) => handleQuantityChange(record._id, value)}
        />
      ),
    },
    {
      title: "Subtotal",
      key: "subtotal",
      render: (_, record) => {
        const subtotal = record.price * (record.quantity || 1);
        return `$${subtotal.toFixed(2)}`;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemove(record._id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="cart-container">
          <Empty
            description="Your cart is empty"
            style={{ marginTop: 100 }}
          />
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/")}
            style={{ marginTop: 20 }}
          >
            Continue Shopping
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="cart-container">
        <h1>Shopping Cart</h1>

        <Row gutter={[20, 20]}>
          <Col xs={24} lg={16}>
            <Card>
              <Table
                columns={columns}
                dataSource={cartItems.map((item) => ({
                  ...item,
                  key: item._id,
                }))}
                pagination={false}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="order-summary">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Tax (10%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>

              <div className="summary-row total">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handleCheckout}
                style={{ marginTop: 20 }}
              >
                Proceed to Checkout
              </Button>

              <Button
                block
                style={{ marginTop: 10 }}
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
}
