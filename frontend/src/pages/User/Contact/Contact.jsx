import React from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from "@ant-design/icons";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./Contact.css";

const { TextArea } = Input;

export default function Contact() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log("Form values:", values);
        message.success("Cảm ơn! Tin nhắn của bạn đã được gửi thành công.");
        form.resetFields();
    };

    return (
        <>
            <Header />
            <div className="contact-page">
                {/* CONTACT HEADER */}
                <div className="contact-header">
                    <h1>Liên hệ</h1>
                    <p>Chúng tôi rất muốn lắng nghe từ bạn. Hãy liên hệ với đội ngũ ngay hôm nay!</p>
                </div>

                <div className="contact-container">
                    <div className="contact-wrapper">

                        {/* LEFT: CONTACT DETAILS */}
                        <div className="contact-info">
                            <h2>Giữ liên lạc</h2>
                            <p className="contact-desc">
                                Nếu bạn có câu hỏi về sản phẩm hay vận chuyển, đội ngũ chuyên nghiệp rất sẵn lòng trả lời mọi thắc mắc.
                            </p>

                            <div className="info-item">
                                <div className="info-icon">
                                    <EnvironmentOutlined />
                                </div>
                                <div className="info-text">
                                    <h3>Trụ sở chính</h3>
                                    <p>123 Đường Fresh, Quận Nông dân, NY 10001, USA</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <PhoneOutlined />
                                </div>
                                <div className="info-text">
                                    <h3>Gọi cho chúng tôi</h3>
                                    <p>+1 (555) 123-4567</p>
                                    <p className="sub-text">Thứ 2-Thứ 6, 8h-17h</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <MailOutlined />
                                </div>
                                <div className="info-text">
                                    <h3>Gửi Email</h3>
                                    <p>support@freshmart.com</p>
                                    <p className="sub-text">Chúng tôi sẽ trả lời trong vòng 24 giờ</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: CONTACT FORM */}
                        <div className="contact-form-container">
                            <h2>Gửi tin nhắn</h2>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                className="contact-form"
                            >
                                <Form.Item
                                    label="Tên của bạn"
                                    name="name"
                                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                                >
                                    <Input size="large" placeholder="Nguyễn Văn A" />
                                </Form.Item>

                                <Form.Item
                                    label="Địa chỉ Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập email" },
                                        { type: "email", message: "Vui lòng nhập địa chỉ email hợp lệ" }
                                    ]}
                                >
                                    <Input size="large" placeholder="nguyenvana@example.com" />
                                </Form.Item>

                                <Form.Item
                                    label="Tiêu đề"
                                    name="subject"
                                    rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                                >
                                    <Input size="large" placeholder="Chúng tôi có thể giúp gì cho bạn?" />
                                </Form.Item>

                                <Form.Item
                                    label="Nội dung"
                                    name="message"
                                    rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
                                >
                                    <TextArea rows={5} placeholder="Viết tin nhắn của bạn ở đây..." />
                                </Form.Item>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    icon={<SendOutlined />}
                                    className="submit-btn"
                                >
                                    Gửi tin nhắn
                                </Button>
                            </Form>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
