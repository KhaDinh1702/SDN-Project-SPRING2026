import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Rate, Button, message, Spin } from "antd";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./ProductDetail.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`);
      const result = await response.json();
      if (result.success) {
        setProduct(result.data);
      } else {
        message.error(result.message || "Product not found");
      }
    } catch (error) {
      message.error("Failed to load product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // LOAD REVIEW FROM LOCALSTORAGE
  useEffect(() => {
    const saved = localStorage.getItem(`reviews_${id}`);
    if (saved) {
      setReviews(JSON.parse(saved));
    }
  }, [id]);

  const handleSubmitReview = () => {
    if (!feedback || userRating === 0) {
      message.warning("Please enter rating and review");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"Guest","avatar":"https://i.pravatar.cc/100?img=1"}');

    const newReview = {
      name: currentUser.first_name || currentUser.name || "Guest",
      avatar: currentUser.avatar || "https://i.pravatar.cc/100?img=1",
      rating: userRating,
      comment: feedback,
      date: new Date().toLocaleDateString(),
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));

    setFeedback("");
    setUserRating(0);
    message.success("Review submitted!");
  };

  if (loading) return <Spin size="large" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }} />;
  if (!product) return <div>Product not found</div>;

  return (
    <>
      <Header />

      <div className="product-detail">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Home
        </button>

        <div className="detail-grid">
          {/* LEFT */}
          <div>
            <div className="product-detail-image">
              <img src={product.image} alt={product.title} />
            </div>

            {/* FEEDBACK */}
            <div className="feedback-section">
              <h3>Write a Review</h3>

              <div className="user-info">
                <img src={currentUser.avatar} alt="avatar" />
                <span>{currentUser.name}</span>
              </div>

              <Rate value={userRating} onChange={setUserRating} />

              <textarea
                placeholder="Share your experience..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              <Button type="primary" block onClick={handleSubmitReview}>
                Submit Review
              </Button>
            </div>

            {/* REVIEW LIST */}
            <div className="review-list">
              <h3>Customer Reviews</h3>

              {reviews.length === 0 && (
                <p className="no-review">No reviews yet.</p>
              )}

              {reviews.map((r, i) => (
                <div key={i} className="review-item">
                  <div className="review-header">
                    <img src={r.avatar} alt={r.name} />
                    <div>
                      <strong>{r.name}</strong>
                      <Rate disabled value={r.rating} />
                    </div>
                  </div>

                  <p>{r.comment}</p>
                  <span className="review-date">{r.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="detail-info">
            <span className="category">{product.category_id?.name || "N/A"}</span>
            <h1>{product.name}</h1>

            <div className="rating">
              <Rate disabled defaultValue={product.rating || 0} />
              <span className="review">{product.rating || 0} ({product.reviews_count || 0} reviews)</span>
            </div>

            <div className="price">
              ${product.price}
              <span className="stock">{product.current_stock || 0} in stock</span>
            </div>

            <p className="description">{product.description || "No description available"}</p>

            <div className="info-box">
              <strong>SKU</strong>
              <p>{product.sku || "N/A"}</p>
            </div>

            <div className="info-box">
              <strong>Status</strong>
              <p>{product.status || "Active"}</p>
            </div>

            <Button type="primary" size="large" block>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
