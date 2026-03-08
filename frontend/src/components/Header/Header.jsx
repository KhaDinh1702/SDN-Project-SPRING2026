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
    message.success("Đăng xuất thành công");
    navigate("/login");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ của tôi",
      onClick: () => navigate("/profile"),
    },
    {
      key: "history",
      icon: <ShoppingCartOutlined />,
      label: "Lịch sử mua hàng",
      onClick: () => navigate("/history"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
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
        <a onClick={() => navigate("/category")}>Danh mục</a>
        <a onClick={() => navigate("/ingredients")}>Món ăn</a>
        <a onClick={() => navigate("/about")}>Giới thiệu</a>
        <a onClick={() => navigate("/blog")}>Bài viết</a>
        <a onClick={() => navigate("/contact")}>Liên hệ</a>
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
                Xin chào, <strong>{user.fullName || user.email}</strong>
              </span>
            </div>
          </Dropdown>
        ) : (
          <>
            <Button
              className="btn-signin"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>

            <Button
              type="primary"
              className="btn-signup"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </Button>
          </>
        )}
      </div>
    </header>
  );
}