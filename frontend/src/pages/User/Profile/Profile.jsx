import { useState, useEffect } from "react";
import { Button, message } from "antd";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import "./Profile.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { API_URL } from "../../../config";

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [purchaseSummary, setPurchaseSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        username: "",
        phone: "",
    });

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Tải thông tin hồ sơ thất bại");
            }

            setProfile(data.data);
            setForm({
                first_name: data.data.first_name || "",
                last_name: data.data.last_name || "",
                username: data.data.username || "",
                phone: data.data.phone || "",
            });

            try {
                const summaryRes = await fetch(`${API_URL}/api/orders/user/${data.data._id}/summary`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const summaryData = await summaryRes.json();
                if (summaryData.success) {
                    setPurchaseSummary(summaryData.data);
                }
            } catch (summaryErr) {
                console.error("Failed to fetch purchase summary", summaryErr);
            }
        } catch (err) {
            message.error(err.message || "Tải thông tin hồ sơ thất bại");
            if (err.message?.includes("Unauthorized") || err.message?.includes("token")) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/users/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Cập nhật hồ sơ thất bại");
            }

            message.success("Cập nhật hồ sơ thành công!");
            setEditing(false);

            // Refresh profile data
            await fetchProfile();

            // Update localStorage user info
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...storedUser,
                    first_name: form.first_name,
                    last_name: form.last_name,
                    fullName: `${form.first_name} ${form.last_name}`,
                })
            );
        } catch (err) {
            message.error(err.message || "Cập nhật hồ sơ thất bại");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        if (profile) {
            setForm({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
                username: profile.username || "",
                phone: profile.phone || "",
            });
        }
    };

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="profile-page">
                    <div className="profile-card" style={{ textAlign: "center", padding: 60 }}>
                        Đang tải...
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!profile) {
        return (
            <>
                <Header />
                <div className="profile-page">
                    <div className="profile-card" style={{ textAlign: "center" }}>
                        <h1>Lỗi</h1>
                        <p>Không thể tải hồ sơ.</p>
                        <Button type="primary" onClick={() => navigate("/")}>
                            Về trang chủ
                        </Button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <div className="profile-page">
                <div className="profile-card">
                    {/* HEADER */}
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {profile.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt="avatar"
                                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                                />
                            ) : (
                                <UserOutlined />
                            )}
                        </div>
                        <div className="profile-header-info">
                            <h1>{profile.first_name} {profile.last_name}</h1>
                            <span className="role-badge">
                                {profile.role_id?.name || "customer"}
                            </span>
                        </div>
                    </div>

                    {/* PURCHASE HISTORY SUMMARY */}
                    {purchaseSummary && (
                        <div className="purchase-summary">
                            <div className="summary-item">
                                <strong>{(purchaseSummary.total_spent || 0).toLocaleString("vi-VN")} VND</strong>
                                <span>Tổng chi tiêu</span>
                            </div>
                            <div className="summary-item">
                                <strong>{purchaseSummary.total_items}</strong>
                                <span>Sản phẩm đã mua</span>
                            </div>
                            <div className="summary-item">
                                <strong>{purchaseSummary.total_orders}</strong>
                                <span>Đơn hàng</span>
                            </div>
                        </div>
                    )}

                    {/* FORM */}
                    <div className="profile-row">
                        <div>
                            <label>Tên</label>
                            <div className={`profile-input-box ${!editing ? "disabled" : ""}`}>
                                <UserOutlined />
                                <input
                                    value={form.first_name}
                                    onChange={(e) => handleChange("first_name", e.target.value)}
                                    disabled={!editing}
                                    placeholder="Tên"
                                />
                            </div>
                        </div>
                        <div>
                            <label>Họ</label>
                            <div className={`profile-input-box ${!editing ? "disabled" : ""}`}>
                                <UserOutlined />
                                <input
                                    value={form.last_name}
                                    onChange={(e) => handleChange("last_name", e.target.value)}
                                    disabled={!editing}
                                    placeholder="Họ"
                                />
                            </div>
                        </div>
                    </div>

                    <label>Email</label>
                    <div className="profile-input-box disabled">
                        <MailOutlined />
                        <input value={profile.email} disabled />
                    </div>

                    <label>Tên đăng nhập</label>
                    <div className={`profile-input-box ${!editing ? "disabled" : ""}`}>
                        <UserOutlined />
                        <input
                            value={form.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                            disabled={!editing}
                            placeholder="Tên đăng nhập"
                        />
                    </div>

                    <label>Số điện thoại</label>
                    <div className={`profile-input-box ${!editing ? "disabled" : ""}`}>
                        <PhoneOutlined />
                        <input
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            disabled={!editing}
                            placeholder="Số điện thoại"
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="profile-actions">
                        {!editing ? (
                            <Button
                                type="primary"
                                block
                                className="profile-save-btn"
                                onClick={() => setEditing(true)}
                            >
                                Chỉnh sửa hồ sơ
                            </Button>
                        ) : (
                            <>
                                <Button
                                    block
                                    className="profile-cancel-btn"
                                    onClick={handleCancel}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="primary"
                                    block
                                    className="profile-save-btn"
                                    loading={saving}
                                    onClick={handleSave}
                                >
                                    Lưu thay đổi
                                </Button>
                            </>
                        )}
                    </div>

                    {/* META */}
                    <div className="profile-meta">
                        Thành viên từ ngày {new Date(profile.created_at).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
