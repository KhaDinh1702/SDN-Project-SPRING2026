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
        message.success("Thank you! Your message has been sent successfully.");
        form.resetFields();
    };

    return (
        <>
            <Header />
            <div className="contact-page">
                {/* CONTACT HEADER */}
                <div className="contact-header">
                    <h1>Contact Us</h1>
                    <p>We'd love to hear from you. Get in touch with our team today!</p>
                </div>

                <div className="contact-container">
                    <div className="contact-wrapper">

                        {/* LEFT: CONTACT DETAILS */}
                        <div className="contact-info">
                            <h2>Get in Touch</h2>
                            <p className="contact-desc">
                                Whether you have a question about our products, delivery, or anything else, our team is ready to answer all your questions.
                            </p>

                            <div className="info-item">
                                <div className="info-icon">
                                    <EnvironmentOutlined />
                                </div>
                                <div className="info-text">
                                    <h3>Our Head Office</h3>
                                    <p>123 Fresh Ave, Farming District, NY 10001, USA</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <PhoneOutlined />
                                </div>
                                <div className="info-text">
                                    <h3>Call Us</h3>
                                    <p>+1 (555) 123-4567</p>
                                    <p className="sub-text">Mon-Fri from 8am to 5pm</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <div className="info-icon">
                                    <MailOutlined />
                                </div>
                                <div className="info-text">
                                    <h3>Email Us</h3>
                                    <p>support@freshmart.com</p>
                                    <p className="sub-text">We'll respond within 24 hours</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: CONTACT FORM */}
                        <div className="contact-form-container">
                            <h2>Send a Message</h2>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                className="contact-form"
                            >
                                <Form.Item
                                    label="Your Name"
                                    name="name"
                                    rules={[{ required: true, message: "Please enter your name" }]}
                                >
                                    <Input size="large" placeholder="John Doe" />
                                </Form.Item>

                                <Form.Item
                                    label="Email Address"
                                    name="email"
                                    rules={[
                                        { required: true, message: "Please enter your email" },
                                        { type: "email", message: "Please enter a valid email address" }
                                    ]}
                                >
                                    <Input size="large" placeholder="john@example.com" />
                                </Form.Item>

                                <Form.Item
                                    label="Subject"
                                    name="subject"
                                    rules={[{ required: true, message: "Please enter a subject" }]}
                                >
                                    <Input size="large" placeholder="How can we help you?" />
                                </Form.Item>

                                <Form.Item
                                    label="Message"
                                    name="message"
                                    rules={[{ required: true, message: "Please enter your message" }]}
                                >
                                    <TextArea rows={5} placeholder="Write your message here..." />
                                </Form.Item>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    icon={<SendOutlined />}
                                    className="submit-btn"
                                >
                                    Send Message
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
