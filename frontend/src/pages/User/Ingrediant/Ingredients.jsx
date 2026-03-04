import React, { useState } from "react";
import { Layout, Card, Row, Col } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";

import "./Ingredients.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const { Content } = Layout;

const dishesData = [
  {
    title: "Beef Steak with Mushroom Sauce",
    desc: "Tender beef steak cooked to perfection with a rich mushroom cream sauce",
    time: "30 mins",
    servings: 2,
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
    ingredients: [
      { name: "Beef Steak", amount: "600g", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f" },
      { name: "Mushrooms", amount: "250g", image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443" },
      { name: "Onion", amount: "1", image: "https://images.unsplash.com/photo-1508747703725-719777637510" },
      { name: "Garlic", amount: "2 cloves", image: "https://images.unsplash.com/photo-1582515073490-dc5c3b77b1e1" },
      { name: "Butter", amount: "50g", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d" },
      { name: "Heavy Cream", amount: "200ml", image: "https://images.unsplash.com/photo-1585238342028-4c3a53a5f8e6" }
    ]
  },
  {
    title: "Grilled Salmon with Vegetables",
    desc: "Fresh salmon fillet grilled with seasonal vegetables",
    time: "25 mins",
    servings: 2,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    ingredients: [
      { name: "Salmon", amount: "500g", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369" },
      { name: "Broccoli", amount: "200g", image: "https://images.unsplash.com/photo-1582515073490-dc5c3b77b1e1" },
      { name: "Lemon", amount: "1", image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924" }
    ]
  },
  {
    title: "Vegetable Stir Fry",
    desc: "Colorful vegetables tossed in savory sauce",
    time: "20 mins",
    servings: 3,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    ingredients: [
      { name: "Bell Pepper", amount: "2 pcs", image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83" },
      { name: "Carrot", amount: "2", image: "https://images.unsplash.com/photo-1582515073490-dc5c3b77b1e1" },
      { name: "Soy Sauce", amount: "3 tbsp", image: "https://images.unsplash.com/photo-1617191517002-39f1a0f0e6d4" }
    ]
  },
  {
    title: "Fish Tacos",
    desc: "Crispy fish with cabbage slaw",
    time: "25 mins",
    servings: 4,
    image: "https://images.unsplash.com/photo-1604908177522-4023d6b0e6f2",
    ingredients: [
      { name: "Fish Fillet", amount: "400g", image: "https://images.unsplash.com/photo-1604908177522-4023d6b0e6f2" },
      { name: "Tortilla", amount: "4 pcs", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e" },
      { name: "Cabbage", amount: "150g", image: "https://images.unsplash.com/photo-1582515073490-dc5c3b77b1e1" }
    ]
  },
  {
    title: "Herb Roasted Chicken",
    desc: "Whole chicken roasted with herbs",
    time: "90 mins",
    servings: 4,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e",
    ingredients: [
      { name: "Chicken", amount: "1 whole", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369" },
      { name: "Rosemary", amount: "2 sprigs", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2" }
    ]
  },
  {
    title: "Shrimp Pasta Primavera",
    desc: "Shrimp with creamy pasta",
    time: "30 mins",
    servings: 3,
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
    ingredients: [
      { name: "Shrimp", amount: "300g", image: "https://images.unsplash.com/photo-1565680018434-b513d6e4df63" },
      { name: "Pasta", amount: "400g", image: "https://images.unsplash.com/photo-1589308078056-f9e5f44b3c28" }
    ]
  },
  {
    title: "BBQ Ribs",
    desc: "Slow cooked ribs with BBQ sauce",
    time: "120 mins",
    servings: 4,
    image: "https://images.unsplash.com/photo-1558030006-450675393462",
    ingredients: [
      { name: "Pork Ribs", amount: "1kg", image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" }
    ]
  },
  {
    title: "Caesar Salad",
    desc: "Classic romaine lettuce with parmesan",
    time: "15 mins",
    servings: 2,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f",
    ingredients: [
      { name: "Lettuce", amount: "200g", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f" },
      { name: "Parmesan", amount: "50g", image: "https://images.unsplash.com/photo-1585238342028-4c3a53a5f8e6" }
    ]
  },
  {
    title: "Burger Deluxe",
    desc: "Juicy beef burger with cheese",
    time: "20 mins",
    servings: 2,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    ingredients: [
      { name: "Beef Patty", amount: "2 pcs", image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" },
      { name: "Cheese", amount: "2 slices", image: "https://images.unsplash.com/photo-1585238342028-4c3a53a5f8e6" }
    ]
  },
  {
    title: "Tomato Soup",
    desc: "Creamy tomato soup",
    time: "25 mins",
    servings: 3,
    image: "https://images.unsplash.com/photo-1604908554048-4b1b3e04a7f7",
    ingredients: [
      { name: "Tomatoes", amount: "500g", image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce" },
      { name: "Cream", amount: "100ml", image: "https://images.unsplash.com/photo-1585238342028-4c3a53a5f8e6" }
    ]
  }
];

export default function Ingredients() {
  const [selectedDish, setSelectedDish] = useState(dishesData[0]);

  return (
    <Layout className="ingredient-layout">
      <Header />
      <Content className="ingredient-container">

        <div className="hero-section">
          <h1>Recipe Ingredients</h1>
          <p>Discover dishes and find all the fresh products you need in one place</p>
        </div>

        <Row gutter={60}>
          <Col span={10}>
            <h3 className="browse-title">Browse Dishes</h3>

            {dishesData.map((dish, index) => (
              <Card
                key={index}
                onClick={() => setSelectedDish(dish)}
                className={`dish-card ${selectedDish.title === dish.title ? "active-card" : ""}`}
              >
                <Row gutter={15}>
                  <Col span={6}>
                    <img src={dish.image} className="dish-img" alt="" />
                  </Col>
                  <Col span={18}>
                    <h4>{dish.title}</h4>
                    <p className="dish-desc">{dish.desc}</p>
                    <div className="dish-meta">
                      <ClockCircleOutlined /> {dish.time}
                      <UserOutlined style={{ marginLeft: 20 }} /> {dish.servings} servings
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}
          </Col>

          <Col span={14}>
            <img src={selectedDish.image} className="main-image" alt="" />

            <h2 className="main-title">{selectedDish.title}</h2>
            <p className="main-desc">{selectedDish.desc}</p>

            <div className="detail-meta">
              <div><ClockCircleOutlined /> Prep Time <strong>{selectedDish.time}</strong></div>
              <div><UserOutlined /> Servings <strong>{selectedDish.servings}</strong></div>
            </div>

            <h3 className="ingredient-title">Ingredients</h3>

            <div className="ingredient-box">
              {selectedDish.ingredients.map((item, i) => (
                <div key={i} className="ingredient-row">
                  <div className="ingredient-left">
                    <img src={item.image} alt="" />
                    <span>{item.name}</span>
                  </div>
                  <span className="ingredient-amount">{item.amount}</span>
                </div>
              ))}
            </div>
            <h3 className="available-title">Available Products</h3>

<div className="product-grid">
  {selectedDish.ingredients.map((item, i) => (
    <div key={i} className="product-card">
      <img src={item.image} alt="" />
      <div className="product-info">
        <span className="product-category">Ingredient</span>
        <h4>{item.name}</h4>
        <div className="product-bottom">
          <span className="product-price">{item.amount}</span>
          <button className="add-btn">Add</button>
        </div>
      </div>
    </div>
  ))}
</div>

          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
}