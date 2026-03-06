import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  images?: Array<{ url: string }>; // keep minimal shape
};

type CartContextType = {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: CartItem, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // load from storage
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('fm_cart');
        if (stored) setCartItems(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to load cart', e);
      }
    })();
  }, []);

  // persist
  useEffect(() => {
    AsyncStorage.setItem('fm_cart', JSON.stringify(cartItems)).catch(() => {});
  }, [cartItems]);

  const addToCart = (product: CartItem, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item._id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: Math.max(1, newQty) };
          }
          return item;
        })
        .filter((i) => i.quantity > 0),
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

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
      }}>
      {children}
    </CartContext.Provider>
  );
};
