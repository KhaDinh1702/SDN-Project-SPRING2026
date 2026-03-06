import React from "react";
import { Card, Button, Input } from "antd";
import { ArrowRightOutlined, SearchOutlined } from "@ant-design/icons";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./Blog.css";

const { Meta } = Card;

const mockPosts = [
    {
        id: 1,
        title: "10 Reasons to Switch to Organic Produce",
        excerpt: "Discover the amazing health benefits of going organic and why it matters for your family and the environment.",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
        date: "Oct 12, 2026",
        author: "Jane Smith",
    },
    {
        id: 2,
        title: "Delicious Fall Recipes with Seasonal Vegetables",
        excerpt: "Cozy up this autumn with these incredible, easy-to-make recipes using fresh produce from your local farmers.",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600",
        date: "Oct 05, 2026",
        author: "Chef Michael",
    },
    {
        id: 3,
        title: "How to Store Your Vegetables to Keep Them Fresh Longer",
        excerpt: "Stop throwing away spoiled food! Follow these pro tips to extend the lifespan of your greens and roots.",
        image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=600",
        date: "Sep 28, 2026",
        author: "Sarah Connor",
    },
    {
        id: 4,
        title: "The Ultimate Guide to Superfoods",
        excerpt: "What are superfoods exactly? We break down the top 10 nutrient-dense foods you should be eating right now.",
        image: "https://images.unsplash.com/photo-1498837167922-41c5463ff4af?auto=format&fit=crop&q=80&w=600",
        date: "Sep 20, 2026",
        author: "John Doe",
    },
    {
        id: 5,
        title: "Farm to Table: The Journey of Your Food",
        excerpt: "Ever wonder how your tomatoes get to your salad? Read about the fascinating supply chain of fresh produce.",
        image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=600",
        date: "Sep 15, 2026",
        author: "Jane Smith",
    },
    {
        id: 6,
        title: "Why You Should Eat More Leafy Greens",
        excerpt: "Kale, spinach, and arugula - oh my! Learn why your mom was right about finishing your greens.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
        date: "Sep 10, 2026",
        author: "Chef Michael",
    }
];

export default function Blog() {
    return (
        <>
            <Header />
            <div className="blog-page">
                {/* BLOG HEADER */}
                <div className="blog-header">
                    <div className="blog-header-content">
                        <h1>FreshMart Blog</h1>
                        <p>News, tips, and recipes straight from the farm.</p>
                        <div className="blog-search">
                            <Input
                                size="large"
                                placeholder="Search articles..."
                                prefix={<SearchOutlined />}
                                style={{ borderRadius: "30px", maxWidth: "400px" }}
                            />
                        </div>
                    </div>
                </div>

                {/* BLOG CONTENT */}
                <div className="blog-container">
                    <div className="blog-grid">
                        {mockPosts.map((post) => (
                            <Card
                                key={post.id}
                                hoverable
                                className="blog-card"
                                cover={<img alt={post.title} src={post.image} className="blog-card-img" />}
                            >
                                <div className="blog-meta">
                                    <span>{post.date}</span>
                                    <span className="dot">•</span>
                                    <span>{post.author}</span>
                                </div>
                                <Meta
                                    title={post.title}
                                    description={
                                        <div>
                                            <p className="blog-excerpt">{post.excerpt}</p>
                                            <Button type="link" className="read-more-btn">
                                                Read More <ArrowRightOutlined />
                                            </Button>
                                        </div>
                                    }
                                />
                            </Card>
                        ))}
                    </div>

                    <div className="blog-pagination">
                        <Button size="large" type="primary" shape="round">Load More Articles</Button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
