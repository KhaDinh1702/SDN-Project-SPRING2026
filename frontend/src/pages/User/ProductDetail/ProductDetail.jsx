import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Rate, Button } from "antd";
import { CartContext } from "../../../context/CartContext";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./ProductDetail.css";

// MOCK USER LOGIN
const currentUser = {
  name: "Nguyen Gia Trieu",
  avatar: "https://i.pravatar.cc/100?img=12",
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // FEEDBACK STATE
  const [feedback, setFeedback] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // LOAD REVIEW FROM LOCALSTORAGE
  useEffect(() => {
    const saved = localStorage.getItem(`reviews_${id}`);
    if (saved) {
      setReviews(JSON.parse(saved));
    }
  }, [id]);

  const handleSubmitReview = () => {
    if (!feedback || userRating === 0) return;

    const newReview = {
      name: currentUser.name,
      avatar: currentUser.avatar,
      rating: userRating,
      comment: feedback,
      date: new Date().toLocaleDateString(),
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));

    setFeedback("");
    setUserRating(0);
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
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
              <img src={product.images?.[0]?.url || "https://via.placeholder.com/600"} alt={product.name} />
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
            <span className="category">{product.category?.name || "Uncategorized"}</span>
            <h1>{product.name}</h1>

            <div className="rating">
              <Rate disabled defaultValue={5} />
              <span className="review">4.9 (89 reviews)</span>
            </div>

            <div className="price">
              ${product.price}
              <span className="stock">{product.stock_quantity || 0} in stock</span>
            </div>

            <p className="description">{product.description || "No description available."}</p>

            <div className="info-box">
              <strong>Origin</strong>
              <p>{product.origin || "Unknown"}</p>
            </div>

            <h3>Nutritional Content</h3>
            <div className="nutrition">
              {(product.nutrition || [
                { name: "Protein", value: "26g" },
                { name: "Iron", value: "2.8mg" }
              ]).map((n, i) => (
                <div key={i}>
                  <strong>{n.name}</strong>
                  <span>{n.value}</span>
                </div>
              ))}
            </div>

            <Button type="primary" size="large" block onClick={() => addToCart(product, 1)}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
