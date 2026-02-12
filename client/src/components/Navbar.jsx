import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const { toggleCart, cart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            FoodieHub
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link to="/" className="text-gray-800 hover:text-primary transition-colors font-medium">Home</Link>
                            <Link to="/menu" className="text-gray-600 hover:text-primary transition-colors font-medium">Menu</Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="text-primary font-bold hover:text-emerald-700 transition-colors">Admin Panel</Link>
                            )}
                            {user?.role === 'delivery' && (
                                <Link to="/delivery" className="text-secondary font-bold hover:text-amber-600 transition-colors">Deliveries</Link>
                            )}
                            <Link to="/about" className="text-gray-600 hover:text-primary transition-colors font-medium">About</Link>
                            <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors font-medium">Contact</Link>
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            onClick={toggleCart}
                            className="text-gray-600 hover:text-primary transition-colors relative"
                        >
                            <ShoppingBag size={24} />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile" className="flex items-center gap-2 text-gray-700 font-medium hover:text-primary transition-colors bg-gray-100 px-3 py-1.5 rounded-full">
                                    <User size={18} />
                                    <span>{user.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors font-medium">
                                    <span className="font-medium">Login</span>
                                </Link>
                                <Link to="/signup" className="flex items-center space-x-2 bg-primary hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-emerald-500/30 transform hover:scale-105">
                                    <User size={18} />
                                    <span className="font-medium">Sign Up</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-primary p-2"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link to="/" className="block px-3 py-2 text-primary font-medium">Home</Link>
                            <Link to="/menu" className="block px-3 py-2 text-gray-600 hover:text-primary">Menu</Link>
                            <Link to="/about" className="block px-3 py-2 text-gray-600 hover:text-primary">About</Link>
                            <Link to="/contact" className="block px-3 py-2 text-gray-600 hover:text-primary">Contact</Link>
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 text-red-500 font-medium"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-primary">Login</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
