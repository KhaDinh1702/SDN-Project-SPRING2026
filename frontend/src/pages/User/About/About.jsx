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
                        <h1>Fresh, Healthy, Organic</h1>
                        <p>
                            We believe in delivering the highest quality farm-fresh produce
                            right to your doorstep, ensuring health and happiness for your family.
                        </p>
                    </div>
                </section>

                {/* OUR STORY SECTION */}
                <section className="about-story container">
                    <div className="story-image">
                        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" alt="Farm Fresh" />
                    </div>
                    <div className="story-text">
                        <h2>Our Story</h2>
                        <p>
                            Founded in 2020, FreshMart started with a simple belief: everyone
                            deserves access to fresh, healthy, and organic food. What began as a
                            small local market has grown into a community of farmers and families
                            dedicated to sustainable eating.
                        </p>
                        <p>
                            We partner directly with local farms to bring you produce that is
                            harvested at peak ripeness. No middleman, no long storage times. Just
                            pure, natural goodness from the farm to your table.
                        </p>
                    </div>
                </section>

                {/* OUR VALUES SECTION */}
                <section className="about-values bg-light">
                    <div className="container">
                        <h2 className="text-center mb-4">Why Choose Us</h2>
                        <div className="values-grid">
                            <div className="value-card">
                                <CheckCircleOutlined className="value-icon" />
                                <h3>100% Organic</h3>
                                <p>We guarantee all our products are certified organic and free from harmful pesticides.</p>
                            </div>
                            <div className="value-card">
                                <CarOutlined className="value-icon" />
                                <h3>Fast Delivery</h3>
                                <p>Freshness matters. That's why we offer same-day delivery to keep your food perfectly fresh.</p>
                            </div>
                            <div className="value-card">
                                <SafetyCertificateOutlined className="value-icon" />
                                <h3>Top Quality</h3>
                                <p>Our quality control team inspects every item to ensure only the best reaches your kitchen.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MEET THE TEAM SECTION */}
                <section className="about-team container">
                    <h2 className="text-center mb-4">Meet the Team</h2>
                    <div className="team-grid">
                        <div className="team-member">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" alt="CEO" />
                            <h3>John Doe</h3>
                            <p>Founder & CEO</p>
                        </div>
                        <div className="team-member">
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" alt="Manager" />
                            <h3>Jane Smith</h3>
                            <p>Operations Manager</p>
                        </div>
                        <div className="team-member">
                            <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" alt="Head Chef" />
                            <h3>Michael Lee</h3>
                            <p>Head of Logistics</p>
                        </div>
                        <div className="team-member">
                            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" alt="Marketing" />
                            <h3>Sarah Connor</h3>
                            <p>Marketing Director</p>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
