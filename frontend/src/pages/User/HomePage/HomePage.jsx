import { Layout, Button, Rate, Spin, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./HomePage.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const { Content } = Layout;
const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      message.error("Failed to load categories");
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      message.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="layout">
      <Header />

      <Content>
        {/* ===== HERO ===== */}
        <section className="hero">
          <div className="hero-text">
            <h1>Fresh from Farm to Your Table</h1>
            <p>
              Premium quality vegetables, meat, and fish delivered fresh to your
              doorstep.
            </p>
            <div className="hero-actions">
              <Button type="primary">Shop Now</Button>
              <Button>Learn More</Button>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e"
            alt="hero"
          />
        </section>

        {/* ===== CATEGORY ===== */}
        <section className="section">
          <h2>Shop by Category</h2>
          <p className="subtitle">Browse our premium selection</p>

          <div className="category-grid">
            {categories.map((c, i) => (
              <div className="category-card" key={i}>
                <img src={c.image} alt={c.name} />
                <h4>{c.name}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section className="section section-featured">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">
            Our most popular items this week
          </p>

          <Spin spinning={loading} description="Loading products...">
            <div className="product-grid">
              {products.slice(0, 6).map((p) => (
                <div
                  className="product-card"
                  key={p._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/products/${p._id}`)}
                >
                  <div className="product-image">
                    <img src={p.image || "https://via.placeholder.com/200"} alt={p.name} />
                  </div>

                  <div className="product-body">
                    <span className="product-category">{p.category_id?.name || "N/A"}</span>
                    <h3>{p.name}</h3>

                    <div className="product-rate">
                      <Rate disabled defaultValue={p.rating || 0} />
                      <span className="rate-count">({p.reviews_count || 0})</span>
                    </div>

                    <div className="product-footer">
                      <span className="product-price">${p.price}</span>

                      <Button
                        className="btn-view"
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/products/${p._id}`);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Spin>
        </section>

        {/* ===== WHY CHOOSE ===== */}
        <section className="why-section">
          <h2 className="why-title">Why Choose FreshMart?</h2>
          <p className="why-subtitle">
            Quality, freshness, and sustainability in every order
          </p>

          <div className="why-grid">
            <div className="why-item">
              <div className="why-icon">🌿</div>
              <h3>Farm Fresh</h3>
              <p>Sourced directly from local farms</p>
            </div>

            <div className="why-item">
              <div className="why-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Same-day delivery available</p>
            </div>

            <div className="why-item">
              <div className="why-icon">🛡️</div>
              <h3>Quality Guaranteed</h3>
              <p>Handpicked for premium quality</p>
            </div>

            <div className="why-item">
              <div className="why-icon">🏅</div>
              <h3>Certified Organic</h3>
              <p>90% of products are organic</p>
            </div>
          </div>
        </section>

        {/* ===== NEWSLETTER ===== */}
        <section className="newsletter-section">
          <h2 className="newsletter-title">Stay Updated</h2>
          <p className="newsletter-subtitle">
            Subscribe for exclusive deals & tips
          </p>

          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </section>
      </Content>

      <Footer />
    </Layout>
  );
}
