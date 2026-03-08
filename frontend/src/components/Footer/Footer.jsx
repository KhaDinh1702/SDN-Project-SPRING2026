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
          <p>Sản phẩm nông trại tươi sạch giao đến tận cửa nhà bạn</p>
        </div>

        {/* SHOP */}
        <div className="footer-col">
          <h4>Cửa hàng</h4>
          <ul>
            <li onClick={() => navigate("/category")}>Rau củ</li>
            <li onClick={() => navigate("/category")}>Thịt</li>
            <li onClick={() => navigate("/category")}>Cá & Hải sản</li>
          </ul>
        </div>

        {/* COMPANY */}
        <div className="footer-col">
          <h4>Công ty</h4>
          <ul>
            <li onClick={() => navigate("/about")}>Về chúng tôi</li>
            <li onClick={() => navigate("/blog")}>Bài viết</li>
            <li onClick={() => navigate("/contact")}>Liên hệ</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div className="footer-col">
          <h4>Hỗ trợ</h4>
          <ul>
            <li onClick={() => navigate("/faq")}>Câu hỏi thường gặp</li>
            <li onClick={() => navigate("/contact")}>Thông tin giao hàng</li>
            <li onClick={() => navigate("/contact")}>Đổi trả</li>
          </ul>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <span>© 2026 FreshMart. Đã đăng ký bản quyền.</span>
        <div className="footer-links">
          <a onClick={() => navigate("/privacy")} style={{ cursor: "pointer" }}>Chính sách bảo mật</a>
          <a onClick={() => navigate("/terms")} style={{ cursor: "pointer" }}>Điều khoản dịch vụ</a>
        </div>
      </div>
    </footer>
  );
}
