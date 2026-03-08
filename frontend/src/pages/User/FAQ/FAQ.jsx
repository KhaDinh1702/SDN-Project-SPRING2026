import React from "react";
import { Collapse } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./FAQ.css";

const { Panel } = Collapse;

const faqData = [
    {
        category: "Đặt hàng & Thanh toán",
        questions: [
            {
                q: "Các phương thức thanh toán hiện có?",
                a: "Chúng tôi hỗ trợ VNPay, thẻ Tín dụng/Ghi nợ, và tiền mặt khi giao hàng (với một số khu vực nhất định)."
            },
            {
                q: "Làm thế nào để theo dõi đơn hàng?",
                a: "Khi đơn hàng được giao, bạn sẽ nhận được mã theo dõi qua email, hoặc có thể kiểm tra ở phần 'Lịch sử mua hàng' tài khoản."
            },
            {
                q: "Tôi có thể hủy hay thay đổi đơn được không?",
                a: "Bạn có thể hủy hoặc sửa đơn trong khoảng 1 giờ kể từ lúc đặt hàng bằng cách liên hệ đội ngũ hỗ trợ."
            }
        ]
    },
    {
        category: "Vận chuyển & Giao hàng",
        questions: [
            {
                q: "Có giao hàng trong ngày không?",
                a: "Có! Giao hàng trong ngày áp dụng cho đơn đặt trước 12:00 trưa ở khu vực nội thành."
            },
            {
                q: "Sẽ ra sao nếu tôi không có mặt để nhận hàng?",
                a: "Chúng tôi sẽ gửi tại ban quản lý tòa nhà, hoặc người giao nhận sẽ bảo lưu gói hàng rồi hẹn sang ngày sau."
            },
            {
                q: "Phí vận chuyển là bao nhiêu?",
                a: "Tiêu chuẩn là miễn phí nếu đơn trên 500,000 VND. Trường hợp này sẽ cộng thêm 50,000 phí."
            }
        ]
    },
    {
        category: "Sản phẩm & Chất lượng",
        questions: [
            {
                q: "Sản phẩm có thực sự chuẩn hữu cơ?",
                a: "Đa số nông sản tại siêu thị đều được chứng nhận hữu cơ xanh."
            },
            {
                q: "Chính sách đổi trả nông sản?",
                a: "Sự cam kết về chất lượng là 100%. Mọi ý kiến hoàn trả xin cung cấp chi tiết trong 24 giờ kể từ lúc nhận."
            }
        ]
    }
];

export default function FAQ() {
    return (
        <>
            <Header />
            <div className="faq-page">
                {/* FAQ HEADER */}
                <div className="faq-header">
                    <h1>Câu hỏi thường gặp</h1>
                    <p>Tìm câu trả lời cho các câu hỏi phổ biến về sản phẩm, giao hàng và dịch vụ của chúng tôi.</p>
                </div>

                {/* FAQ CONTENT */}
                <div className="faq-container">
                    <div className="faq-intro">
                        <QuestionCircleOutlined className="faq-icon" />
                        <h2>Chúng tôi có thể giúp gì cho bạn?</h2>
                        <p>Nếu bạn không tìm thấy câu trả lời đang cần, hãy truy cập trang Liên hệ và gửi tin nhắn.</p>
                    </div>

                    <div className="faq-categories">
                        {faqData.map((category, index) => (
                            <div key={index} className="faq-category-section">
                                <h3 className="category-title">{category.category}</h3>
                                <Collapse ghost expandIconPosition="end" className="faq-collapse">
                                    {category.questions.map((item, idx) => (
                                        <Panel header={<span className="faq-question">{item.q}</span>} key={`${index}-${idx}`}>
                                            <p className="faq-answer">{item.a}</p>
                                        </Panel>
                                    ))}
                                </Collapse>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
