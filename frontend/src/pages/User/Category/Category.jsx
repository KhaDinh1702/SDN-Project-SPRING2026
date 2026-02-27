import React, { useState, useEffect, useMemo } from "react";
import { Layout, Select, Spin, Input } from "antd";
import { ArrowLeftOutlined, StarFilled } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom"; // 👈 thêm useParams
import "./Category.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const { Content } = Layout;
const { Option } = Select;
const { Search } = Input;

export default function Category() {
  const navigate = useNavigate();
  const { id } = useParams(); // 👈 lấy id từ URL

  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("default");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/categories");
        const data = await res.json();

        if (data.success) {
          setCategories(data.data);

          // 👇 nếu có id trên URL thì chọn đúng category đó
          if (id) {
            const found = data.data.find((c) => c._id === id);
            if (found) {
              setActiveCategoryId(found._id);
              setActiveCategoryName(found.name);
            }
          } else if (data.data.length > 0) {
            setActiveCategoryId(data.data[0]._id);
            setActiveCategoryName(data.data[0].name);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [id]); // 👈 phụ thuộc id

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    if (!activeCategoryId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url = `http://localhost:5001/api/products?categoryId=${activeCategoryId}`;

        if (keyword) {
          url += `&keyword=${keyword}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategoryId, keyword]);

  const sortedProducts = useMemo(() => {
    const copied = [...products];

    if (sort === "low") return copied.sort((a, b) => a.price - b.price);
    if (sort === "high") return copied.sort((a, b) => b.price - a.price);

    return copied;
  }, [products, sort]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <Header />

      <Content className="category-container">
        <div className="category-hero">
          <div className="back" onClick={() => navigate("/")}>
            <ArrowLeftOutlined /> Back to home
          </div>

          <h1>{activeCategoryName}</h1>
          <p>
            Fresh and premium{" "}
            {activeCategoryName?.toLowerCase()} delivered daily
          </p>
        </div>

        <div className="category-top">
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`filter-btn ${
                  activeCategoryId === cat._id ? "active-btn" : ""
                }`}
                onClick={() => {
                  setActiveCategoryId(cat._id);
                  setActiveCategoryName(cat.name);
                  navigate(`/category/${cat._id}`); // 👈 cập nhật URL
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <Search
            placeholder="Search product..."
            onSearch={(value) => setKeyword(value)}
            allowClear
            style={{ width: 200 }}
          />

          <Select
            value={sort}
            onChange={(value) => setSort(value)}
            className="sort-select"
          >
            <Option value="default">Default</Option>
            <Option value="low">Price: Low to High</Option>
            <Option value="high">Price: High to Low</Option>
          </Select>
        </div>

        <div className="product-grid">
          {sortedProducts.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: 50 }}>
              No products found.
            </p>
          ) : (
            sortedProducts.map((item) => (
              <div key={item._id} className="product-card">
                {item.images?.[0]?.isPrimary && (
                  <span className="badge">New</span>
                )}

                <img
                  src={
                    item.images?.[0]?.url ||
                    "https://via.placeholder.com/300"
                  }
                  alt={item.name}
                />

                <div className="product-info">
                  <span className="category-label">
                    {item.category?.name}
                  </span>

                  <h3>{item.name}</h3>

                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <StarFilled key={i} />
                    ))}
                  </div>

                  <div className="bottom">
                    <span className="price">${item.price}</span>
                    <button className="add-btn">Add</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Content>

      <Footer />
    </Layout>
  );
}