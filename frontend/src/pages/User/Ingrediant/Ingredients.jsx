import React, { useState, useEffect, useContext } from "react";
import { Layout, Card, Row, Col } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";

import "./Ingredients.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { CartContext } from "../../../context/CartContext";
import { API_URL } from "../../../config";

const { Content } = Layout;



export default function Ingredients() {
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addMultipleToCart, addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dishes`);
        const json = await res.json();
        if (res.ok) {
          const fetchedDishes = json.data || json;
          setDishes(fetchedDishes);
          if (fetchedDishes.length > 0) {
            setSelectedDish(fetchedDishes[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dishes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);

  const handleAddAllIngredients = () => {
    if (!selectedDish || !selectedDish.products) return;

    const itemsToAdd = selectedDish.products.map(p => ({
      product: p.product,
      quantity: p.quantity
    }));

    addMultipleToCart(itemsToAdd);
  };

  return (
    <Layout className="ingredient-layout">
      <Header />
      <Content className="ingredient-container">

        <div className="hero-section">
          <h1>Nguyên liệu Món ăn</h1>
          <p>Khám phá các món ăn và tìm tất cả những nguyên liệu tươi ngon bạn cần</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>Đang tải món ăn...</div>
        ) : dishes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px" }}>Không tìm thấy món ăn nào.</div>
        ) : (
          <Row gutter={60}>
            <Col span={10}>
              <h3 className="browse-title">Khám phá món ăn</h3>

              {dishes.map((dish) => (
                <Card
                  key={dish._id}
                  onClick={() => setSelectedDish(dish)}
                  className={`dish-card ${selectedDish?._id === dish._id ? "active-card" : ""}`}
                >
                  <Row gutter={15}>
                    <Col span={6}>
                      <img src={dish.images?.[0]?.url || dish.images?.[0]} className="dish-img" alt={dish.name} />
                    </Col>
                    <Col span={18}>
                      <h4>{dish.name}</h4>
                      <p className="dish-desc">{dish.description}</p>
                      <div className="dish-meta">
                        <ClockCircleOutlined /> 30 phút
                        <UserOutlined style={{ marginLeft: 20 }} /> 2 phần ăn
                      </div>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Col>

            <Col span={14}>
              {selectedDish && (
                <>
                  <img src={selectedDish.images?.[0]?.url || selectedDish.images?.[0]} className="main-image" alt={selectedDish.name} />

                  <h2 className="main-title">{selectedDish.name}</h2>
                  <p className="main-desc">{selectedDish.description}</p>

                  <div className="detail-meta">
                    <div><ClockCircleOutlined /> Thời gian chuẩn bị <strong>30 phút</strong></div>
                    <div><UserOutlined /> Phần ăn <strong>2</strong></div>
                    <button
                      className="add-btn"
                      onClick={handleAddAllIngredients}
                      style={{ marginLeft: 'auto', padding: '10px 20px', fontSize: '16px' }}
                    >
                      Thêm tất cả nguyên liệu vào giỏ
                    </button>
                  </div>

                  <h3 className="ingredient-title">Nguyên liệu</h3>

                  <div className="ingredient-box">
                    {selectedDish.products?.map((item, i) => (
                      <div key={i} className="ingredient-row">
                        <div className="ingredient-left">
                          <img src={item.product?.images?.[0]?.url || item.product?.images?.[0]} alt={item.product?.name} />
                          <span>{item.product?.name}</span>
                        </div>
                        <span className="ingredient-amount">SL: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <h3 className="available-title">Sản phẩm có sẵn</h3>

                  <div className="product-grid">
                    {selectedDish.products?.map((item, i) => (
                      <div key={i} className="product-card">
                        <img src={item.product?.images?.[0]?.url || item.product?.images?.[0]} alt={item.product?.name} />
                        <div className="product-info">
                          <span className="product-category">Nguyên liệu</span>
                          <h4>{item.product?.name}</h4>
                          <div className="product-bottom">
                            <span className="product-price">{(item.product?.price || 0).toLocaleString("vi-VN")} VND</span>
                            <button
                              className="add-btn"
                              onClick={() => addToCart(item.product, item.quantity)}
                            >
                              Thêm
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Col>
          </Row>
        )}
      </Content>
      <Footer />
    </Layout>
  );
}