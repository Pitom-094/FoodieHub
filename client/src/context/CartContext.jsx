import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const newTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);
    }, [cart]);

    const addToCart = (food) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item._id === food._id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...food, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item._id === id) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    return (
        <CartContext.Provider
            value={{
                cart,
                isCartOpen,
                toggleCart,
                addToCart,
                removeFromCart,
                updateQuantity,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
