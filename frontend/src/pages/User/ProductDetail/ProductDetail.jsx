import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Rate, Button, Checkbox, Input } from "antd";
import { CartContext } from "../../../context/CartContext";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./ProductDetail.css";

import { API_URL } from "../../../config";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [feedback, setFeedback] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    if (userStr && accessToken) {
      setCurrentUser(JSON.parse(userStr));
      setToken(accessToken);
    }
  }, []);

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

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/product/${id}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  useEffect(() => {
    if (id) fetchReviews();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!feedback || userRating === 0) return;
    if (!currentUser || !token) {
      alert("Please log in to submit a review.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          rating: userRating,
          comment: feedback,
          isAnonymous,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setFeedback("");
        setUserRating(0);
        setIsAnonymous(false);
        fetchReviews();
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Submit review error:", err);
      alert("An error occurred while submitting the review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        fetchReviews();
      } else {
        alert(data.message || "Failed to delete review");
      }
    } catch (err) {
      console.error("Delete review error:", err);
      alert("An error occurred while deleting the review.");
    }
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

              {currentUser ? (
                <>
                  <div className="user-info">
                    <img src={isAnonymous ? "https://i.pravatar.cc/100" : currentUser.avatar_url || "https://i.pravatar.cc/100"} alt="avatar" />
                    <span>{isAnonymous ? "Anonymous" : `${currentUser.first_name} ${currentUser.last_name}`}</span>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <Checkbox
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    >
                      Post anonymously
                    </Checkbox>
                  </div>

                  <Rate allowHalf value={userRating} onChange={setUserRating} style={{ marginBottom: "1rem" }} />

                  <textarea
                    placeholder="Share your experience..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px", width: "100%", height: "80px", marginBottom: "1rem" }}
                  />

                  <Button type="primary" block onClick={handleSubmitReview}>
                    Submit Review
                  </Button>
                </>
              ) : (
                <div style={{ padding: "10px 0", color: "#666" }}>
                  Please <a href="/login" style={{ color: "var(--primary-color)", fontWeight: "bold" }}>log in</a> to write a review.
                </div>
              )}
            </div>

            {/* REVIEW LIST */}
            <div className="review-list">
              <h3>Customer Reviews</h3>

              {reviews.length === 0 && (
                <p className="no-review">No reviews yet.</p>
              )}

              {reviews.map((r) => (
                <div key={r._id} className="review-item">
                  <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={r.isAnonymous ? "https://i.pravatar.cc/100" : r.user?.avatar_url || "https://i.pravatar.cc/100"} alt={r.isAnonymous ? "Anonymous" : r.user?.first_name || "User"} />
                      <div>
                        <strong>{r.isAnonymous ? "Anonymous" : `${r.user?.first_name || ""} ${r.user?.last_name || ""}`.trim() || "Anonymous"}</strong>
                        <Rate disabled allowHalf value={r.rating} />
                      </div>
                    </div>
                    {currentUser && currentUser.id === r.user?._id && (
                      <Button type="text" danger onClick={() => handleDeleteReview(r._id)}>
                        Delete
                      </Button>
                    )}
                  </div>

                  <p>{r.comment}</p>
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="detail-info">
            <span className="category">{product.category?.name || "Uncategorized"}</span>
            <h1>{product.name}</h1>

            <div className="rating">
              <Rate disabled allowHalf defaultValue={5} />
              <span className="review">4.9 (89 reviews)</span>
            </div>

            <div className="price">
              {(product.price).toLocaleString("vi-VN")} VND <span style={{ fontSize: 16, color: '#6b7280' }}>/ {product.weight} {product.unit}</span>
              <span className="stock" style={{ display: 'block', marginTop: 10, fontSize: 14 }}>{product.stock_quantity || 0} in stock</span>
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
