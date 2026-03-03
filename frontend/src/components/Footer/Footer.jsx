import "./Footer.css";
import { Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-top">
        {/* BRAND */}
        <div className="footer-brand">
          <div className="footer-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <Leaf size={20} />
            <span>FreshMart</span>
          </div>
          <p>Farm fresh products delivered to your door</p>
        </div>

        {/* SHOP */}
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li onClick={() => navigate("/category")}>Vegetables</li>
            <li onClick={() => navigate("/category")}>Meat</li>
            <li onClick={() => navigate("/category")}>Fish & Seafood</li>
          </ul>
        </div>

        {/* COMPANY */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li onClick={() => navigate("/about")}>About Us</li>
            <li onClick={() => navigate("/blog")}>Blog</li>
            <li onClick={() => navigate("/contact")}>Contact</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li onClick={() => navigate("/faq")}>FAQ</li>
            <li onClick={() => navigate("/contact")}>Shipping Info</li>
            <li onClick={() => navigate("/contact")}>Returns</li>
          </ul>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <span>© 2026 FreshMart. All rights reserved.</span>
        <div className="footer-links">
          <a onClick={() => navigate("/privacy")} style={{ cursor: "pointer" }}>Privacy Policy</a>
          <a onClick={() => navigate("/terms")} style={{ cursor: "pointer" }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
