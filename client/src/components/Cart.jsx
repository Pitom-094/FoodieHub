import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, total } = useCart();
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Your Order</h2>
                            <button onClick={toggleCart} className="text-gray-500 hover:text-red-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <p className="text-lg font-medium">Your cart is empty</p>
                                    <p className="text-sm">Add some delicious food!</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item._id} className="flex gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h3>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-primary font-bold text-sm">৳{item.price}</p>

                                            <div className="flex items-center space-x-3 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item._id, -1)}
                                                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, 1)}
                                                    className="p-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="border-t p-6 bg-gray-50">
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-bold text-xl text-gray-900">৳{total.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        toggleCart();
                                        navigate('/checkout'); // We will build this page later
                                    }}
                                    className="w-full py-4 bg-primary hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:scale-[1.02] active:scale-95"
                                >
                                    Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Cart;
