import React, { useState } from "react";
import { Layout, Select } from "antd";
import { ArrowLeftOutlined, StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Category.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";



const { Content } = Layout;
const { Option } = Select;

const allProducts = [
  // VEGETABLES
  {
    name: "Organic Tomatoes",
    category: "Vegetables",
    price: 4.99,
    rating: 4,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
    badge: "New"
  },
  {
    name: "Spinach Bundle",
    category: "Vegetables",
    price: 3.49,
    rating: 4,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb"
  },
  {
    name: "Broccoli Florets",
    category: "Vegetables",
    price: 5.99,
    rating: 4,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1582515073490-dc5c3b77b1e1"
  },
  {
    name: "Fresh Carrots",
    category: "Vegetables",
    price: 2.99,
    rating: 4,
    reviews: 66,
    image: "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae"
  },

  // MEAT
  {
    name: "Premium Beef Steak",
    category: "Meat",
    price: 18.99,
    rating: 5,
    reviews: 88,
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
  },
  {
    name: "Chicken Breast",
    category: "Meat",
    price: 12.49,
    rating: 4,
    reviews: 75,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d"
  },
  {
    name: "Pork Ribs",
    category: "Meat",
    price: 15.99,
    rating: 5,
    reviews: 54,
    image: "https://images.unsplash.com/photo-1605478031425-1c2b7a4f06f4"
  },
  {
    name: "Lamb Chops",
    category: "Meat",
    price: 21.99,
    rating: 5,
    reviews: 40,
    image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962a3"
  },

  // FISH
  {
    name: "Fresh Salmon",
    category: "Fish",
    price: 16.49,
    rating: 5,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369",
    badge: "Sale"
  },
  {
    name: "Tuna Steak",
    category: "Fish",
    price: 14.99,
    rating: 4,
    reviews: 53,
    image: "https://images.unsplash.com/photo-1589308078055-eb1b03c94f01"
  },
  {
    name: "Shrimp Pack",
    category: "Fish",
    price: 11.49,
    rating: 4,
    reviews: 82,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950"
  },
  {
    name: "Sea Bass",
    category: "Fish",
    price: 19.99,
    rating: 5,
    reviews: 36,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3"
  },

  // SPICES
  {
    name: "Black Pepper",
    category: "Spices",
    price: 2.99,
    rating: 4,
    reviews: 40,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d"
  },
  {
    name: "Sea Salt",
    category: "Spices",
    price: 1.99,
    rating: 4,
    reviews: 34,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
  },
  {
    name: "Turmeric Powder",
    category: "Spices",
    price: 3.49,
    rating: 5,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1615486363903-06e9b0c68f37"
  },
  {
    name: "Paprika",
    category: "Spices",
    price: 3.99,
    rating: 4,
    reviews: 22,
    image: "https://images.unsplash.com/photo-1604908177522-4020dbffa8b5"
  }
];

export default function Category() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Vegetables");
  const [sort, setSort] = useState("default");

  const filtered = allProducts
    .filter(p => p.category === activeCategory)
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
          <h1>{activeCategory}</h1>
          <p>Fresh and premium {activeCategory.toLowerCase()} delivered daily</p>
        </div>

        <div className="category-top">
          <div className="filter-buttons">
            {["Vegetables", "Meat", "Fish", "Spices"].map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? "active-btn" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <Select
            defaultValue="default"
            onChange={value => setSort(value)}
            className="sort-select"
          >
            <Option value="default">Default</Option>
            <Option value="low">Price: Low to High</Option>
            <Option value="high">Price: High to Low</Option>
          </Select>
        </div>

        <div className="product-grid">
          {filtered.map((item, index) => (
            <div key={index} className="product-card">
              {item.badge && <span className="badge">{item.badge}</span>}
              <img src={item.image} alt="" />
              <div className="product-info">
                <span className="category-label">{item.category}</span>
                <h3>{item.name}</h3>

                <div className="rating">
                  {[...Array(item.rating)].map((_, i) => (
                    <StarFilled key={i} />
                  ))}
                  <span>({item.reviews})</span>
                </div>

                <div className="bottom">
                  <span className="price">${item.price}</span>
                  <button className="add-btn">Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </Content>
      <Footer />
    </Layout>
  );
}