import React, { useState, useEffect } from "react";
import { Layout, Select, Spin, message, Empty } from "antd";
import { ArrowLeftOutlined, StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Category.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const { Content } = Layout;
const { Option } = Select;
const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Category() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setCategories(result.data);
        setActiveCategory(result.data[0]._id);
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
        setAllProducts(result.data);
      }
    } catch (error) {
      message.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    try {
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      message.success(`${product.name} added to cart!`);
    } catch (error) {
      message.error("Error adding to cart");
      console.error(error);
    }
  };

  const filtered = allProducts
    .filter((p) => p.category_id?._id === activeCategory)
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  return (
    <Layout>
      <Header />
      <Content className="category-container">

        <div className="category-hero">
          <div className="back" onClick={() => navigate("/")}>
            <ArrowLeftOutlined /> Back to home
          </div>
          <h1>{categories.find((c) => c._id === activeCategory)?.name || "Category"}</h1>
          <p>Fresh and premium products delivered daily</p>
        </div>

        <div className="category-top">
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`filter-btn ${activeCategory === cat._id ? "active-btn" : ""}`}
                onClick={() => setActiveCategory(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <Select
            defaultValue="default"
            onChange={(value) => setSort(value)}
            className="sort-select"
          >
            <Option value="default">Default</Option>
            <Option value="low">Price: Low to High</Option>
            <Option value="high">Price: High to Low</Option>
          </Select>
        </div>

        <Spin spinning={loading} description="Loading products...">
          {filtered.length === 0 ? (
            <Empty description="No products found" style={{ marginTop: 50 }} />
          ) : (
            <div className="product-grid">
              {filtered.map((item) => (
                <div key={item._id} className="product-card">
                  <img src={item.image || "https://via.placeholder.com/200"} alt={item.name} />
                  <div className="product-info">
                    <span className="category-label">{item.category_id?.name || "N/A"}</span>
                    <h3>{item.name}</h3>

                    <div className="rating">
                      {[...Array(Math.min(item.rating || 0, 5))].map((_, i) => (
                        <StarFilled key={i} />
                      ))}
                      <span>({item.reviews_count || 0})</span>
                    </div>

                    <div className="bottom">
                      <span className="price">${item.price}</span>
                      <button
                        className="add-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Spin>

      </Content>
      <Footer />
    </Layout>
  );
}