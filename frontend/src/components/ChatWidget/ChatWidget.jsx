import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './ChatWidget.css';
import { CartContext } from '../../context/CartContext';
import { message } from 'antd';

const ChatWidget = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: 'Chào bạn! Mình là trợ lý AI của FreshMart. Bạn đang cần tìm kiếm sản phẩm gì hay cần gợi ý thực đơn hôm nay, cứ hỏi mình nhé!'
        }
    ]);
    const [inputVal, setInputVal] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const { addToCart } = useContext(CartContext);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Stop rendering entirely if not on the Home Page
    if (location.pathname !== '/') {
        return null;
    }

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputVal.trim()) return;

        const userMsg = inputVal.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInputVal('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/ai/suggest`,
                { ingredients: userMsg }
            );

            if (response.data.success && response.data.text) {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: response.data.text,
                    suggestedItems: response.data.suggestedItems || []
                }]);
            } else {
                setMessages(prev => [...prev, { sender: 'bot', text: 'Xin lỗi, mình đang gặp chút trục trặc. Bạn thử lại sau nhé!' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Đã có lỗi xảy ra kết nối với hệ thống AI.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        message.success(`Đã thêm ${product.name} vào giỏ!`);
    };

    return (
        <div className='chat-widget-container'>
            {/* Chat Window */}
            {isOpen && (
                <div className='chat-window'>
                    <div className='chat-header'>
                        <div className='chat-avatar'>FM</div>
                        <div>
                            <h3>Trợ lý FreshMart</h3>
                            <p>Sẵn sàng hỗ trợ bạn</p>
                        </div>
                    </div>

                    <div className='chat-messages'>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.sender}`}>
                                {msg.text.split('\n').map((line, i) => (
                                    <span key={`t-${i}`}>
                                        {line}
                                        <br />
                                    </span>
                                ))}

                                {/* Render Suggested Products from AI */}
                                {msg.suggestedItems && msg.suggestedItems.length > 0 && (
                                    <div className="suggested-products">
                                        <p className="suggested-title">Sản phẩm gợi ý:</p>
                                        {msg.suggestedItems.map(item => (
                                            <div className="chat-product-card" key={item._id}>
                                                {item.images && item.images[0] && (
                                                    <img src={item.images[0].url} alt={item.name} className="chat-product-img" />
                                                )}
                                                <div className="chat-product-info">
                                                    <p className="chat-product-name">{item.name}</p>
                                                    <p className="chat-product-price">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                    </p>
                                                    <button
                                                        className="chat-add-btn"
                                                        onClick={() => handleAddToCart(item)}
                                                    >
                                                        + Thêm vào giỏ
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className='message bot loading'>
                                Đang xử lý...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className='chat-input-area' onSubmit={handleSend}>
                        <input
                            type='text'
                            className='chat-input'
                            placeholder='Nhập yêu cầu của bạn...'
                            value={inputVal}
                            onChange={e => setInputVal(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type='submit'
                            className='chat-send-btn'
                            disabled={loading || !inputVal.trim()}
                        >
                            ➤
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <button
                className={`chat-fab ${isOpen ? 'open' : ''}`}
                onClick={toggleChat}
                aria-label="Toggle AI Chat"
            >
                {isOpen ? '✕' : '💬'}
            </button>
        </div>
    );
};

export default ChatWidget;
