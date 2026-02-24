import { Layout, Button, Rate } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import "./HomePage.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const { Content } = Layout;

/* ===== DATA ===== */
const categories = [
  {
    name: "Vegetables",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
  },
  {
    name: "Meat",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
  },
  {
    name: "Fish",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
  },
  {
    name: "Fruits",
    image: "https://images.unsplash.com/photo-1574226516831-e1dff420e43e",
  },
];

/* ===== MOCK PRODUCTS (SAU NÀY ĐỔI API) ===== */
const products = [
  {
    id: 1,
    title: "Spinach Bundle",
    category: "Vegetables",
    price: 3.49,
    rate: 4,
    image: "https://images.unsplash.com/photo-1582515073490-39981397c445",
  },
  {
    id: 2,
    title: "Grass-Fed Ground Beef",
    category: "Meat",
    price: 8.99,
    rate: 5,
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f",
  },
  {
    id: 3,
    title: "Wild-Caught Shrimp",
    category: "Fish",
    price: 16.99,
    rate: 4,
    image: "https://images.unsplash.com/photo-1604908554027-3bcd8dce0a5c",
  },
  {
    id: 4,
    title: "Organic Tomatoes",
    category: "Vegetables",
    price: 4.99,
    rate: 4,
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
  },
  {
    id: 5,
    title: "Prime Ribeye Steak",
    category: "Meat",
    price: 18.99,
    rate: 5,
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
  },
  {
    id: 6,
    title: "Fresh Atlantic Salmon",
    category: "Fish",
    price: 14.99,
    rate: 5,
    image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369",
  },
];

export default function HomePage() {
  const navigate = useNavigate(); // ✅ SỬA: chỉ dùng navigate theo id

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

          <div className="product-grid">
            {products.map((p) => (
              <div
                className="product-card"
                key={p.id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/products/${p.id}`)} // ✅ SỬA
              >
                <div className="product-image">
                  <img src={p.image} alt={p.title} />
                </div>

                <div className="product-body">
                  <span className="product-category">{p.category}</span>
                  <h3>{p.title}</h3>

                  <div className="product-rate">
                    <Rate disabled defaultValue={p.rate} />
                    <span className="rate-count">(124)</span>
                  </div>

                  <div className="product-footer">
                    <span className="product-price">${p.price}</span>

                    <Button
                      className="btn-view"
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ SỬA: tránh click lan
                        navigate(`/products/${p.id}`); // ✅ SỬA
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
