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
                throw new Error(data.message || "Failed to load profile");
            }

            setProfile(data.data);
            setForm({
                first_name: data.data.first_name || "",
                last_name: data.data.last_name || "",
                username: data.data.username || "",
                phone: data.data.phone || "",
            });
        } catch (err) {
            message.error(err.message || "Failed to load profile");
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
                throw new Error(data.message || "Failed to update profile");
            }

            message.success("Profile updated successfully!");
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
            message.error(err.message || "Failed to update profile");
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
                        Loading...
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
                        <h1>Error</h1>
                        <p>Could not load profile.</p>
                        <Button type="primary" onClick={() => navigate("/")}>
                            Go Home
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

                    {/* FORM */}
                    <div className="profile-row">
                        <div>
                            <label>First Name</label>
                            <div className={`profile-input-box ${!editing ? "disabled" : ""}`}>
                                <UserOutlined />
                                <input
                                    value={form.first_name}
                                    onChange={(e) => handleChange("first_name", e.target.value)}
                                    disabled={!editing}
                                    placeholder="First name"
                                />
                            </div>
                        </div>
                        <div>
                            <label>Last Name</label>
                            <div className={`profile-input-box ${!editing ? "disabled" : ""}`}>
                                <UserOutlined />
                                <input
                                    value={form.last_name}
                                    onChange={(e) => handleChange("last_name", e.target.value)}
                                    disabled={!editing}
                                    placeholder="Last name"
                                />
                            </div>
                        </div>
                    </div>

                    <label>Email</label>
                    <div className="profile-input-box disabled">
                        <MailOutlined />
                        <input value={profile.email} disabled />
                    </div>

                    <label>Username</label>
                    <div className={`profile-input-box ${!editing ? "disabled" : ""}`}>
                        <UserOutlined />
                        <input
                            value={form.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                            disabled={!editing}
                            placeholder="Username"
                        />
                    </div>

                    <label>Phone</label>
                    <div className={`profile-input-box ${!editing ? "disabled" : ""}`}>
                        <PhoneOutlined />
                        <input
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            disabled={!editing}
                            placeholder="Phone number"
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
                                Edit Profile
                            </Button>
                        ) : (
                            <>
                                <Button
                                    block
                                    className="profile-cancel-btn"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    block
                                    className="profile-save-btn"
                                    loading={saving}
                                    onClick={handleSave}
                                >
                                    Save Changes
                                </Button>
                            </>
                        )}
                    </div>

                    {/* META */}
                    <div className="profile-meta">
                        Member since {new Date(profile.created_at).toLocaleDateString("en-US", {
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
