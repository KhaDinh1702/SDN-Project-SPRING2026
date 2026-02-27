import { useState, useEffect } from "react";
import { Badge, Button, Dropdown, Avatar, message } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { CartContext } from "../../context/CartContext";
import { useContext } from "react";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { totalItems, clearCart } = useContext(CartContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // Even if API fails, still clear local state
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("fm_cart"); // clear cart storage
    clearCart(); // clear cart context
    setUser(null);
    message.success("Logged out successfully");
    navigate("/login");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "My Profile",
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="fm-header">
      {/* LEFT */}
      <div className="fm-logo" onClick={() => navigate("/")}>
        <div className="logo-circle">F</div>
        <span>FreshMart</span>
      </div>

      {/* CENTER */}
      <nav className="fm-menu">
        <a onClick={() => navigate("/category")}>Categories</a>
        <a onClick={() => navigate("/ingredients")}>Food</a>
        <a onClick={() => navigate("/about")}>About</a>
      </nav>

      {/* RIGHT */}
      <div className="fm-actions">
        <Badge count={totalItems} size="small">
          <ShoppingCartOutlined
            className="cart-icon"
            onClick={() => navigate("/cart")}
          />
        </Badge>

        {user ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div className="user-greeting">
              <Avatar
                className="user-avatar"
                icon={<UserOutlined />}
                src={user.avatar}
              />
              <span className="user-name">
                Hello, <strong>{user.fullName || user.email}</strong>
              </span>
            </div>
          </Dropdown>
        ) : (
          <>
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
          </>
        )}
      </div>
    </header>
  );
}