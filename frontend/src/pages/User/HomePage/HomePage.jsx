import { Layout, Button, Rate } from "antd";
import {ShoppingCartOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./HomePage.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const { Content } = Layout;

export default function HomePage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  /* ================= FETCH API ================= */
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/categories");
      const data = await res.json();

      setCategories(
        Array.isArray(data)
          ? data
          : data.data || data.categories || []
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/products");
      const data = await res.json();

      setProducts(
        Array.isArray(data)
          ? data
          : data.data || data.products || []
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <Layout className="layout">
      <Header />

      <Content>
        {/* ===== HERO (GIỮ NGUYÊN) ===== */}
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
<section className="section-category">
  <div className="category-container">
    <h2 className="section-title">Shop by Category</h2>
    <p className="section-subtitle">Browse our premium selection</p>

    <div className="category-grid">
      {categories.map((c) => {
        let imagePath = "";

        if (c.name === "Fish") imagePath = "/images/categories/ca.jpg";
        else if (c.name === "Meat") imagePath = "/images/categories/thit.webp";
        else if (c.name === "Vegetables") imagePath = "/images/categories/rau.jpg";
        else if (c.name === "Spices") imagePath = "/images/categories/giavi.jpg";
        else if (c.name === "Fruits") imagePath = "/images/categories/traicay.webp";

        return (
          <div
            className="category-card"
            key={c._id || c.id}
            onClick={() => navigate(`/category/${c._id || c.id}`)}
          >
            <div className="category-image">
              <img src={imagePath} alt={c.name} />
            </div>
            <h4>{c.name}</h4>
          </div>
        );
      })}
    </div>
  </div>
</section>

        {/* ===== FEATURED PRODUCTS (SỬA ẢNH + TITLE) ===== */}
        <section className="section section-featured">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">
            Our most popular items this week
          </p>

          <div className="product-grid">
            {products.slice(0, 8).map((p) => (
              <div
                className="product-card"
                key={p._id || p.id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/products/${p._id || p.id}`)}
              >
                <div className="product-image">
                  <img
                    src={
                      p.images?.[0]?.url ||
                      "https://via.placeholder.com/300"
                    }
                    alt={p.name}
                  />
                </div>

                <div className="product-body">
                  <span className="product-category">
                    {p.category?.name || p.category}
                  </span>

                  <h3>{p.name}</h3>

                  <div className="product-rate">
                    <Rate disabled defaultValue={p.rate || 5} />
                    <span className="rate-count">(124)</span>
                  </div>

                  <div className="product-footer">
                    <span className="product-price">${p.price}</span>

                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${p._id || p.id}`);
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== WHY CHOOSE (GIỮ NGUYÊN) ===== */}
        <section
          style={{
            padding: "100px 10%",
            background: "#f9fafc",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 34, fontWeight: 700 }}>
            Why Choose FreshMart?
          </h2>
          <p style={{ color: "#666", marginBottom: 60 }}>
            Quality, freshness, and sustainability in every order
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 30,
            }}
          >
            {[
              { icon: "🌿", title: "Farm Fresh", desc: "Sourced directly from trusted farms daily." },
              { icon: "🚚", title: "Fast Delivery", desc: "Same-day delivery for maximum freshness." },
              { icon: "🛡️", title: "Quality Guaranteed", desc: "Strict inspection before shipping." },
              { icon: "🏅", title: "Certified Organic", desc: "90% of products are organic certified." },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: "#fff",
                  padding: 35,
                  borderRadius: 20,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 15 }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 600 }}>{item.title}</h3>
                <p style={{ color: "#666" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== NEWSLETTER (GIỮ NGUYÊN) ===== */}
        <section
          style={{
            padding: "120px 10%",
            background: "linear-gradient(135deg, #00c853, #00bfa5)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(15px)",
              padding: 60,
              borderRadius: 25,
              textAlign: "center",
              color: "white",
              width: "100%",
              maxWidth: 700,
            }}
          >
            <h2 style={{ fontSize: 32, fontWeight: 700 }}>
              Stay Updated
            </h2>
            <p style={{ margin: "20px 0 40px" }}>
              Subscribe to get exclusive deals & fresh market updates
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  padding: "14px 18px",
                  borderRadius: 12,
                  border: "none",
                  width: "60%",
                  outline: "none",
                }}
              />

              <button
                style={{
                  padding: "14px 26px",
                  borderRadius: 12,
                  border: "none",
                  background: "white",
                  color: "#00bfa5",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </Content>

      <Footer />
    </Layout>
  );
}