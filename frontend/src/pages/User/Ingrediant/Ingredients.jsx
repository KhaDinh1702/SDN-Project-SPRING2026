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
  // "all" | "false" (mặn) | "true" (chay)
  const [dietFilter, setDietFilter] = useState("all");
  const { addMultipleToCart, addToCart } = useContext(CartContext);

  const fetchDishes = async (filter = "all") => {
    try {
      setLoading(true);
      let url = `${API_URL}/api/dishes`;
      if (filter !== "all") {
        url += `?is_vegetarian=${filter}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok) {
        const fetchedDishes = json.data || json;
        setDishes(fetchedDishes);
        setSelectedDish(fetchedDishes.length > 0 ? fetchedDishes[0] : null);
      }
    } catch (error) {
      console.error("Failed to fetch dishes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes(dietFilter);
  }, [dietFilter]);

  const handleAddAllIngredients = () => {
    if (!selectedDish || !selectedDish.products) return;
    const itemsToAdd = selectedDish.products.map(p => ({
      product: p.product,
      quantity: p.quantity
    }));
    addMultipleToCart(itemsToAdd);
  };

  const filterTabs = [
    { key: "all", label: "Tất cả" },
    { key: "false", label: "Mặn" },
    { key: "true", label: "Chay" },
  ];

  return (
    <Layout className="ingredient-layout">
      <Header />
      <Content className="ingredient-container">

        <div className="hero-section">
          <h1>Nguyên liệu Món ăn</h1>
          <p>Khám phá các món ăn và tìm tất cả những nguyên liệu tươi ngon bạn cần</p>
        </div>

        {/* Diet filter tabs */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setDietFilter(tab.key)}
              style={{
                padding: "8px 22px",
                borderRadius: 24,
                border: "2px solid",
                borderColor: dietFilter === tab.key ? (tab.key === "true" ? "#52c41a" : tab.key === "false" ? "#fa8c16" : "#1677ff") : "#d9d9d9",
                backgroundColor: dietFilter === tab.key ? (tab.key === "true" ? "#f6ffed" : tab.key === "false" ? "#fff7e6" : "#e6f4ff") : "#fff",
                color: dietFilter === tab.key ? (tab.key === "true" ? "#389e0d" : tab.key === "false" ? "#d46b08" : "#0958d9") : "#595959",
                fontWeight: dietFilter === tab.key ? 600 : 400,
                cursor: "pointer",
                fontSize: 15,
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
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
                  <Row gutter={20} align="middle">
                    <Col span={8}>
                      <img src={dish.images?.[0]?.url || dish.images?.[0]} className="dish-img" alt={dish.name} />
                    </Col>
                    <Col span={16}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <h4 style={{ margin: 0, fontSize: '18px' }}>{dish.name}</h4>
                        <span
                          style={{
                            fontSize: 12,
                            padding: "2px 10px",
                            borderRadius: 12,
                            fontWeight: 600,
                            backgroundColor: dish.is_vegetarian ? "#f6ffed" : "#fff7e6",
                            color: dish.is_vegetarian ? "#389e0d" : "#d46b08",
                            border: `1px solid ${dish.is_vegetarian ? "#b7eb8f" : "#ffd591"}`,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {dish.is_vegetarian ? "🌿 Chay" : "🥩 Mặn"}
                        </span>
                      </div>
                      <p className="dish-desc" style={{ margin: 0, lineHeight: '1.4' }}>{dish.description}</p>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Col>

            <Col span={14}>
              {selectedDish && (
                <>
                  <img src={selectedDish.images?.[0]?.url || selectedDish.images?.[0]} className="main-image" alt={selectedDish.name} />

                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <h2 className="main-title" style={{ margin: 0 }}>{selectedDish.name}</h2>
                    <span
                      style={{
                        fontSize: 13,
                        padding: "2px 12px",
                        borderRadius: 14,
                        fontWeight: 600,
                        backgroundColor: selectedDish.is_vegetarian ? "#f6ffed" : "#fff7e6",
                        color: selectedDish.is_vegetarian ? "#389e0d" : "#d46b08",
                        border: `1px solid ${selectedDish.is_vegetarian ? "#b7eb8f" : "#ffd591"}`,
                      }}
                    >
                      {selectedDish.is_vegetarian ? "🌿 Món Chay" : "🥩 Món Mặn"}
                    </span>
                  </div>
                  <p className="main-desc">{selectedDish.description}</p>

                  <div className="detail-meta">
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