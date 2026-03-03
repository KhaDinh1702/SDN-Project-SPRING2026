import React from "react";
import { Collapse } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./FAQ.css";

const { Panel } = Collapse;

const faqData = [
    {
        category: "Ordering & Payment",
        questions: [
            {
                q: "What payment methods do you accept?",
                a: "We accept PayPal, Credit/Debit cards (Visa, MasterCard, Amex), and cash on delivery for specific locations."
            },
            {
                q: "How can I track my order?",
                a: "Once your order is shipped, you will receive an email with a tracking number. You can also view your order status in the 'Purchase History' section of your profile."
            },
            {
                q: "Can I cancel or modify my order?",
                a: "You can cancel or modify your order within 1 hour of placing it by contacting our support team. After this window, the order will likely be in processing and cannot be changed."
            }
        ]
    },
    {
        category: "Shipping & Delivery",
        questions: [
            {
                q: "Do you offer same-day delivery?",
                a: "Yes! We offer same-day delivery for all orders placed before 12:00 PM within our local coverage area."
            },
            {
                q: "What happens if I'm not home during delivery?",
                a: "If you're an apartment resident, we can leave it with the concierge. Otherwise, our courier will attempt to call you, or reschedule for the next day."
            },
            {
                q: "How much is the shipping fee?",
                a: "Shipping is completely free for orders over $50. For orders under $50, a flat rate of $5 applies."
            }
        ]
    },
    {
        category: "Products & Quality",
        questions: [
            {
                q: "Are all your products organic?",
                a: "The majority of our fresh produce is certified organic. Any item that is not organic will be clearly labeled as 'Conventional' in its description."
            },
            {
                q: "What is your return policy for fresh produce?",
                a: "We guarantee 100% freshness! If you are unsatisfied with the quality of any item, report it within 24 hours of delivery for a full refund or replacement."
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
                    <h1>Frequently Asked Questions</h1>
                    <p>Find answers to common questions about our products, delivery, and services.</p>
                </div>

                {/* FAQ CONTENT */}
                <div className="faq-container">
                    <div className="faq-intro">
                        <QuestionCircleOutlined className="faq-icon" />
                        <h2>How can we help you?</h2>
                        <p>If you cannot find the answer you're looking for, feel free to visit our Contact page and send us a message.</p>
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
