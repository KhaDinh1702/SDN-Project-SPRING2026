import React from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { CheckCircleOutlined, CarOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import "./About.css";

export default function About() {
    return (
        <>
            <Header />
            <div className="about-page">
                {/* HERO SECTION */}
                <section className="about-hero">
                    <div className="about-hero-content">
                        <h1>Tươi Sạch, Khỏe Mạnh, Hữu Cơ</h1>
                        <p>
                            Chúng tôi tin vào việc mang đến những nông sản tươi sạch chất lượng cao nhất trực tiếp đến tận nhà bạn, đảm bảo sức khỏe và hạnh phúc cho gia đình bạn.
                        </p>
                    </div>
                </section>

                {/* OUR STORY SECTION */}
                <section className="about-story container">
                    <div className="story-image">
                        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" alt="Farm Fresh" />
                    </div>
                    <div className="story-text">
                        <h2>Câu chuyện của chúng tôi</h2>
                        <p>
                            Thành lập năm 2026, FreshMart bắt đầu với một niềm tin đơn giản: Cung cấp thực phẩm sạch, tươi khỏe và hữu cơ đến mọi nhà.
                        </p>
                        <p>
                            Chúng tôi hợp tác trực tiếp với nông dân địa phương không qua trung gian, từ đó cung cấp những tinh hoa trọn vẹn từ nông trại đến bàn ăn.
                        </p>
                    </div>
                </section>

                {/* OUR VALUES SECTION */}
                <section className="about-values bg-light">
                    <div className="container">
                        <h2 className="text-center mb-4">Vì sao chọn chúng tôi</h2>
                        <div className="values-grid">
                            <div className="value-card">
                                <CheckCircleOutlined className="value-icon" />
                                <h3>100% Hữu Cơ</h3>
                                <p>Tất cả sản phẩm đều được chứng nhận hữu cơ và không có hóa chất độc hại.</p>
                            </div>
                            <div className="value-card">
                                <CarOutlined className="value-icon" />
                                <h3>Giao Hàng Nhanh</h3>
                                <p>Sự tươi mới là hàng đầu. Vì vậy chúng tôi cung cấp dịch vụ giao hàng trong ngày.</p>
                            </div>
                            <div className="value-card">
                                <SafetyCertificateOutlined className="value-icon" />
                                <h3>Chất Lượng Cao</h3>
                                <p>Đội ngũ kiểm soát chất lượng kiểm tra từng món hàng để đảm bảo chỉ đem phần tốt nhất tới căn bếp của bạn.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MEET THE TEAM SECTION */}
                <section className="about-team container">
                    <h2 className="text-center mb-4">Gặp gỡ Đội ngũ</h2>
                    <div className="team-grid">
                        <div className="team-member">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" alt="CEO" />
                            <h3>Khai Dinh</h3>
                            <p>Người sáng lập & CEO</p>
                        </div>
                        <div className="team-member">
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" alt="Manager" />
                            <h3>Jane Smith</h3>
                            <p>Giám đốc Vận hành</p>
                        </div>
                        <div className="team-member">
                            <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" alt="Head Chef" />
                            <h3>Michael Lee</h3>
                            <p>Trưởng phòng Vận chuyển</p>
                        </div>
                        <div className="team-member">
                            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" alt="Marketing" />
                            <h3>Sarah Connor</h3>
                            <p>Giám đốc Marketing</p>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
