import { createContext, useState, useEffect } from "react";
import { message } from "antd";
import Cookies from "js-cookie";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const getUserData = () => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try { return JSON.parse(stored); } catch (e) { return null; }
        }
        return null;
    };

    const loadCart = () => {
        const user = getUserData();
        const userId = user?._id || user?.id;
        if (userId) {
            const savedCart = Cookies.get(`fm_cart_${userId}`);
            if (savedCart) {
                try {
                    setCartItems(JSON.parse(savedCart));
                } catch (err) {
                    console.error("Failed to parse cart cookie", err);
                    setCartItems([]);
                }
            } else {
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
    };

    // Load from cookie on mount
    useEffect(() => {
        loadCart();

        // Listen for storage events (like login/logout in another tab or same window)
        const handleStorage = () => {
            loadCart();
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    // Sync to cookie on change
    useEffect(() => {
        const user = getUserData();
        const userId = user?._id || user?.id;
        if (userId) {
            Cookies.set(`fm_cart_${userId}`, JSON.stringify(cartItems), { expires: 30 });
        }
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            message.warning("You must login to add items to the cart");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
            return;
        }

        setCartItems((prev) => {
            const productId = product._id || product.id;
            const existing = prev.find((item) => {
                const itemId = item._id || item.id;
                return itemId && productId && itemId === productId;
            });

            if (existing) {
                // update quantity
                const updated = prev.map((item) => {
                    const itemId = item._id || item.id;
                    if (itemId && productId && itemId === productId) {
                        return { ...item, quantity: item.quantity + quantity };
                    }
                    return item;
                });
                message.success(`Increased ${product.name || product.title} quantity`);
                return updated;
            }

            // add new item
            message.success(`Added ${product.name || product.title} to cart`);
            return [
                ...prev,
                {
                    ...product,
                    _id: productId, // standardize on _id
                    quantity,
                },
            ];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item._id !== productId && item.id !== productId));
        message.success("Item removed from cart");
    };

    const updateQuantity = (productId, amount) => {
        setCartItems((prev) => {
            const updated = prev.map((item) => {
                if (item._id === productId || item.id === productId) {
                    const newQuantity = item.quantity + amount;
                    return { ...item, quantity: Math.max(1, newQuantity) }; // prevent < 1
                }
                return item;
            });
            return updated;
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                totalItems,
                totalPrice,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                reloadCart: loadCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
