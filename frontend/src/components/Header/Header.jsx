import { Badge, Button } from "antd";
import {
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="fm-header">
      {/* LEFT */}
      <div className="fm-logo" onClick={() => navigate("/")}>
        <div className="logo-circle">F</div>
        <span>FreshMart</span>
      </div>

      {/* CENTER */}
      <nav className="fm-menu">
        <a>Vegetables</a>
        <a>Meat</a>
        <a>Fish</a>
        <a>Food</a>
        <a>About</a>
      </nav>

      {/* RIGHT */}
      <div className="fm-actions">
        <Badge count={1} size="small">
          <ShoppingCartOutlined className="cart-icon" />
        </Badge>

        <Button
          className="btn-signin"
          onClick={() => navigate("/login")}
        >
          Sign In
        </Button>

        <Button
          type="primary"
          className="btn-signup"
          onClick={() => navigate("/register")}
        >
          Sign Up
        </Button>
      </div>
    </header>
  );
}
