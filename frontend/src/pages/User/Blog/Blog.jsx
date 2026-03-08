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
        title: "10 Lý do chuyển sang Nông sản Hữu cơ",
        excerpt: "Khám phá những lợi ích sức khỏe tuyệt vời của việc sử dụng nông sản hữu cơ và tại sao điều đó quan trọng với gia đình bạn lẫn môi trường.",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
        date: "12 Th10, 2026",
        author: "Jane Smith",
    },
    {
        id: 2,
        title: "Các Công thức Nấu ăn Mùa thu Từ Rau củ Theo mùa",
        excerpt: "Tận hưởng mùa thu ấm áp với những công thức tuyệt vời, dễ nấu, sử dụng luôn nông sản tươi địa phương.",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600",
        date: "05 Th10, 2026",
        author: "Chef Michael",
    },
    {
        id: 3,
        title: "Cách Bảo quản Rau củ Quả Tươi Lâu Hơn",
        excerpt: "Ngừng vứt bỏ đồ ăn hỏng! Làm theo những mẹo chuyên gia này để kéo dài tuổi thọ cho các loại rau ăn lá và rễ.",
        image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=600",
        date: "28 Th09, 2026",
        author: "Sarah Connor",
    },
    {
        id: 4,
        title: "Cẩm nang Toàn tập về Siêu thực phẩm",
        excerpt: "Siêu thực phẩm là gì? Chúng tôi chia sẻ 10 món ăn dinh dưỡng bạn nên ăn ngay từ bây giờ.",
        image: "https://images.unsplash.com/photo-1498837167922-41c5463ff4af?auto=format&fit=crop&q=80&w=600",
        date: "20 Th09, 2026",
        author: "John Doe",
    },
    {
        id: 5,
        title: "Từ Nông trại tới Bàn ăn: Hành trình của Ẩm thực",
        excerpt: "Từng tò mò quả cà chua trong đĩa salad của bạn được vận chuyển tới bằng cách nào không? Hãy đọc về chuỗi cung ứng thú vị của nông sản tươi.",
        image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=600",
        date: "15 Th09, 2026",
        author: "Jane Smith",
    },
    {
        id: 6,
        title: "Tại sao nên Ăn Nhiều Rau xanh Ăn Lá",
        excerpt: "Cải xoăn, chân vịt, arugula - ôi chao! Cùng tìm hiểu xem tại sao mẹ luôn khuyên bạn phải ăn hết rau nhé.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
        date: "10 Th09, 2026",
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
                        <h1>Bài viết FreshMart</h1>
                        <p>Tin tức, mẹo và công thức nấu ăn trực tiếp từ nông trại.</p>
                        <div className="blog-search">
                            <Input
                                size="large"
                                placeholder="Tìm kiếm bài viết..."
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
                                                Đọc thêm <ArrowRightOutlined />
                                            </Button>
                                        </div>
                                    }
                                />
                            </Card>
                        ))}
                    </div>

                    <div className="blog-pagination">
                        <Button size="large" type="primary" shape="round">Tải thêm bài viết</Button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
